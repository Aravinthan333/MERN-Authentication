import nodemailer from "nodemailer";
import dotenv from "dotenv";
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from "../mailtrap/emailTemplates.js";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  // service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_ID,
    pass: process.env.MAIL_PASSWORD,
  },
});

export async function verificationMail(to, verificationToken) {
  try {
    await transporter.sendMail({
      to: to,
      subject: "Verify your Email Id",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
    });

    console.log("Mail send");
  } catch (error) {
    console.log("EERROORR==>>> ", error);
  }
}

// ==================================================================================================================================================================

export const sendPasswordResetMail = async (to, resetURL) => {
  try {
    await transporter.sendMail({
      to: to,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
    });

    console.log("Mail send");
  } catch (error) {
    console.log(error.message);
    // throw new Error(error);
  }
};

// ==================================================================================================================================================================

export const sendResetSuccessEmail = async (email) => {};

// ==================================================================================================================================================================
