import bcrypt from "bcryptjs";
import crypto from "crypto";

import { User } from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";
// import { sendVerificationEmail } from "../mailtrap/emails.js";
import {
  sendPasswordResetMail,
  verificationMail,
} from "../nodemailer/nodemailer.js";
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from "../mailtrap/emailTemplates.js";

const signup = async (req, res) => {
  // console.log(req.body);
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      // throw new Error("All fields are required");
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const useAlreadyExists = await User.findOne({ email });
    // console.log(useAlreadyExists);

    if (useAlreadyExists) {
      // throw new Error("User Already Registered!");
      return res
        .status(400)
        .json({ success: false, message: "User Already Registered!" });
    }

    const salt = 12;
    const hashedPassword = await bcrypt.hashSync(password, salt);
    // console.log(hashedPassword);

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    await user.save();

    generateToken(res, user._id);

    // sendVerificationEmail(user.email, user.name, verificationToken);
    verificationMail(user.email, verificationToken);

    return res
      .status(201)
      .json({ success: true, message: "User created!", user });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ===========================================================================================================

const verifyEmail = async (req, res) => {
  const { code } = req.body;

  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid verification code!" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    await user.save();

    return res.status(200).json({ success: true, message: "Email verified!" });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ===========================================================================================================

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      // throw new Error("All fields are required");
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    // console.log(useAlreadyExists);

    if (!userExists) {
      // throw new Error("User Already Registered!");
      return res
        .status(400)
        .json({ success: false, message: "User Is Not Registered!" });
    }

    const isPasswordValid = await bcrypt.compare(password, userExists.password);

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Password!" });
    }

    generateToken(res, userExists._id);

    userExists.lastLogin = new Date();

    await userExists.save();

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      userExists: {
        ...userExists._doc,
        password: undefined,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      from: "catch",
      message: error.message,
    });
  }
};

// ===========================================================================================================

const logout = async (req, res) => {
  res.clearCookie("token");

  return res.status(200).json({
    success: true,
    message: "Logged out successfully!",
  });
};

// ===========================================================================================================

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    sendPasswordResetMail(
      user.email,
      `http://localhost:5173/reset-password/${resetToken}`
    );

    return res.status(200).send({
      success: true,
      message: "Password reset token sent to your email",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      from: "catch",
      message: error.message,
    });
  }
};

// ===========================================================================================================

const resetPassword = async (req, res) => {
  try {
  } catch (error) {
    return res.status(400).json({
      success: false,
      from: "catch",
      message: error.message,
    });
  }
};

// ===========================================================================================================

export { signup, login, logout, verifyEmail, forgotPassword, resetPassword };
