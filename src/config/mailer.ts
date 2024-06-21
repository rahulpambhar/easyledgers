import nodemailer from "nodemailer";
import { AttachmentLike } from "nodemailer/lib/mailer";
import { Readable } from "nodemailer/lib/xoauth2";

export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendEmail = async (toMail: string, subject: string, body: string | Buffer | Readable | AttachmentLike) => {
    const info = await transporter.sendMail({
        from: process.env.FROM_EMAIL, // sender address
        to: toMail, // list of receivers
        subject: subject, // Subject line
        html: body, // html body
    });

    return info;
};