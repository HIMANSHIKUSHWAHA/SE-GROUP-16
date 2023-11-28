const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const Professional = require('../models/Professional');
const AppError = require('../utils/AppError');

passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
        console.log(`Attempting to find user by email: ${email}`);
        let user = await User.findOne({ email });

        if (!user) {
            console.log(`User not found in User collection, checking Professional collection for email: ${email}`);
            user = await Professional.findOne({ email });
            if (!user) {
                console.log('No user found with this email in both collections.');
                return done(new AppError('Incorrect email.', 401));
            }
        }


        const isMatch = await user.comparePassword(password);
        // const isMatch = user.password === password;
        if (!isMatch) {
            console.log('Password does not match.');
            return done(new AppError('Incorrect password.', 401));
        }

        console.log(`Password matches. Authentication successful for user: ${email}`);
        return done(null, user);
    } catch (error) {
        console.error(`Error during authentication for user ${email}: ${error}`);
        return done(new AppError(error.message, 500));
    }
}));

passport.serializeUser((user, done) => {
    console.log(`Serializing user with id: ${user.id}`);
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        console.log(`Deserializing user with id: ${id}`);
        let user = await User.findById(id);
        if (!user) {
            console.log(`User not found with id: ${id} in User collection, checking Professional collection.`);
            user = await Professional.findById(id);
        }

        if (!user) {
            console.log(`No user found with id: ${id} in both collections.`);
            return done(new AppError('User not found.', 404));
        }

        console.log(`User deserialization successful. User with id: ${id} found.`);
        done(null, user);
    } catch (error) {
        console.error(`Error during deserialization for user id ${id}: ${error}`);
        done(new AppError(error.message, 500));
    }
});

module.exports = passport;