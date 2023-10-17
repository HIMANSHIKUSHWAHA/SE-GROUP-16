require('dotenv').config();
const nodeMailer = require('nodemailer');

//send email function
const sendEmail = async ({ title, email, content, link }) => {
    let transporter = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });


    const option = {
        from: '"FitFriend" <fitfriendapplication@gmail.com>',
        to: email,
        subject: "Password Reset Link",
        text: `You have requested a password reset. Click on this link to reset your password: ${link}`,
    };

    try {
        const info = await transporter.sendMail(option);
        console.log('email sent successfully');
    } catch (error) {
        console.log(error, 'error sending email');
    }
};
module.exports = { sendEmail };
