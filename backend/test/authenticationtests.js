const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const { User, Professional } = require('../../models/User'); // Mock these imports as necessary
const { login, signUpUser, signUpProfessional, verifyOTP, passwordReset, updatePassword } = require('../../controllers/authController');
const AppError = require('../../utils/AppError');
const { sendEmail } = require('../../utils/NodeMailer');

jest.mock('../../models/User');
jest.mock('../../utils/AppError');
jest.mock('../../utils/NodeMailer', () => ({
    sendEmail: jest.fn(),
}));
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn().mockReturnValue('test-token'),
}));

const app = express();
app.use(express.json());

app.post('/login', login);
app.post('/signup/user', signUpUser);
app.post('/signup/professional', signUpProfessional);
app.post('/verifyOTP', verifyOTP);
app.post('/password-reset', passwordReset);
app.post('/update-password', updatePassword);

// Mock Passport functionality
const passport = {
    authenticate: jest.fn((strategy, options, callback) => (req, res, next) => {
        callback(null, true);
    }),
};
jest.mock('passport', () => passport);

// Tests for /login
describe('/login', () => {
    it('should log in an existing user', async () => {
        User.findOne.mockResolvedValue({ _id: '123', email: 'test@example.com' });
        const response = await request(app)
            .post('/login')
            .send({ email: 'test@example.com', password: 'password' });
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            success: true,
            message: 'Authentication succeeded',
            tempToken: 'test-token',
        });
    });
});

// Tests for /signup/user
describe('/signup/user', () => {
    it('should sign up a new user', async () => {
        const mockSave = jest.fn();
        User.mockImplementation(() => ({
            save: mockSave,
            _id: 'new-user-id',
        }));
        sendEmail.mockResolvedValue(true);

        const response = await request(app)
            .post('/signup/user')
            .send({
                email: 'newuser@example.com',
                password: 'newpassword',
                height: '180',
                weight: '75'
            });

        expect(mockSave).toHaveBeenCalled();
        expect(sendEmail).toHaveBeenCalled();
        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual({
            message: 'User registered successfully',
            userId: 'new-user-id',
        });
    });
});

// Tests for /signup/professional
describe('/signup/professional', () => {
    it('should sign up a new professional', async () => {
        const mockSave = jest.fn();
        Professional.mockImplementation(() => ({
            save: mockSave,
            _id: 'new-professional-id',
            email: 'newpro@example.com',
        }));
        sendEmail.mockResolvedValue(true);

        const response = await request(app)
            .post('/signup/professional')
            .send({
                email: 'newpro@example.com',
                password: 'newpassword',
                specialization: 'nutrition'
            });

        expect(mockSave).toHaveBeenCalled();
        expect(sendEmail).toHaveBeenCalled();
        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual({
            message: 'Professional registered successfully',
            userId: 'new-professional-id',
        });
    });
});




// Tests for /verifyOTP
describe('/verifyOTP', () => {
    it('should verify OTP and complete registration', async () => {
        const mockUser = {
            _id: 'user-id',
            otp: '123456',
            otpExpires: Date.now() + 10000,
            save: jest.fn()
        };

        User.findById.mockResolvedValue(mockUser);

        const response = await request(app)
            .post('/verifyOTP')
            .send({ userId: 'user-id', otp: '123456' });

        expect(mockUser.save).toHaveBeenCalled();
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            message: 'User registration completed successfully',
            user: mockUser,
        });
    });

    it('should fail if OTP is expired', async () => {
        const mockUser = {
            _id: 'user-id',
            otp: '123456',
            otpExpires: Date.now() - 10000 // Expired OTP
        };

        User.findById.mockResolvedValue(mockUser);

        const response = await request(app)
            .post('/verifyOTP')
            .send({ userId: 'user-id', otp: '123456' });

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            message: 'Invalid or expired OTP',
        });
    });
});

// Tests for /password-reset
describe('/password-reset', () => {
    it('should initiate a password reset', async () => {
        const mockUser = {
            _id: 'user-id',
            email: 'test@example.com',
            save: jest.fn()
        };

        User.findOne.mockResolvedValue(mockUser);

        const response = await request(app)
            .post('/password-reset')
            .send({ email: 'test@example.com' });

        expect(mockUser.save).toHaveBeenCalled();
        expect(sendEmail).toHaveBeenCalled();
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toContain('If a user with that email');
    });

    it('should return 404 if email does not exist', async () => {
        User.findOne.mockResolvedValue(null);

        const response = await request(app)
            .post('/password-reset')
            .send({ email: 'nonexistent@example.com' });

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({
            message: 'Email address not found',
        });
    });
});

// Tests for /update-password
describe('/update-password', () => {
    it('should update the password for the user', async () => {
        const mockUser = {
            _id: 'user-id',
            resetPasswordToken: 'reset-token',
            resetPasswordExpires: Date.now() + 10000, // Valid token
            save: jest.fn(),
            password: 'oldpassword'
        };

        User.findOne.mockResolvedValue(mockUser);

        const response = await request(app)
            .post('/update-password')
            .send({
                userId: 'user-id',
                resetToken: 'reset-token',
                newPassword: 'newpassword'
            });

        expect(mockUser.save).toHaveBeenCalled();
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            message: 'Password updated successfully',
        });
    });

    it('should return 400 if reset token is invalid', async () => {
        const response = await request(app)
            .post('/update-password')
            .send({
                userId: 'user-id',
                resetToken: 'invalid-token',
                newPassword: 'newpassword'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            message: 'Password reset token is invalid or has expired',
        });
    });
});
it('should return 400 if reset token is invalid', async () => {
    const response = await request(app)
        .post('/update-password')
        .send({
            userId: 'user-id',
            resetToken: 'invalid-token',
            newPassword: 'newpassword'
        });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
        message: 'Password reset token is invalid or has expired',
    });
});


// After all tests
afterAll(() => {
    jest.resetAllMocks();
});

module.exports = app;