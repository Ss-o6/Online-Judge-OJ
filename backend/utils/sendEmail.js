import dotenv from "dotenv";
dotenv.config();
import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, text }) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.USER_PASS // updated to match .env
        }
    });

    const mailOptions = {
        from: {
            name: "AlgoHub",
            address: process.env.EMAIL_USER
        },
        to,
        subject,
        text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
    });
};

export default sendEmail;
