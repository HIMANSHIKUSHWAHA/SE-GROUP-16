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

    // TODO change email to email
    const option = {
        from: '"FitFriend" <fitfriendapplication@gmail.com>',
        to: 'whipmiester@hotmail.com',
        subject: title,
        html: link ? `${content} <a href="${link}">Click here</a>` : content
    };

    try {
        const info = await transporter.sendMail(option);
        console.log('email sent successfully');
    } catch (error) {
        console.log(error, 'error sending email');
    }
};
module.exports = { sendEmail };
