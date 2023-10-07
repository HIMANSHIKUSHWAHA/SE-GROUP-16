require('dotenv').config();
const nodeMailer = require('nodemailer');

console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS);
// Function to send email
const sendEmail = async (email, link) => {
    let transporter = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: "fitfriend10@gmail.com", //email
            pass: "wysy tszs mirw mnze", //google app password
        },
    });

    const option = {
        from: '"FitFriend" <fitfriendapplication@gmail.com>', //sender address
        to: email,
        subject: "Password Reset Link",
        text: `You have requested a password reset. Click on this link to reset your password: ${link}`,
    };
    transporter.sendMail(option, function (error, info) {
        if (error) {
            console.log(error, 'error sending email');
        } else {
            console.log('email sent successfully')
        }
    });
};
module.exports = { sendEmail };
