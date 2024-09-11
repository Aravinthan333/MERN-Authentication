import nodemailer from "nodemailer";
import { VERIFICATION_EMAIL_TEMPLATE } from "../mailtrap/emailTemplates.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // or 'STARTTLS'
  auth: {
    user: "practiceappdev@gmail.com",
    pass: "hcpodragehsmttvu",
  },
});

export async function verificationMail(to, sub, mailContent) {
  try {
    await transporter.sendMail({
      to: to,
      subject: sub,
      html: mailContent,
    });

    console.log("Mail send");
  } catch (error) {
    console.log("EERROORR==>>> ", error);
  }
}

// ==================================================================================================================================================================
