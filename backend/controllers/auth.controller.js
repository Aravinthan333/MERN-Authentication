import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import { User } from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";
// import { sendVerificationEmail } from "../mailtrap/emails.js";
import {
  sendPasswordResetMail,
  sendResetSuccessEmail,
  verificationMail,
} from "../nodemailer/nodemailer.js";

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
    // console.log("req.bogy  :  ", email, password);
    if (!email || !password) {
      // throw new Error("All fields are required");
      console.log("errorr trigger");
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    // console.log("User in db", userExists);

    if (!user) {
      // throw new Error("User Already Registered!");
      return res
        .status(400)
        .json({ success: false, message: "User Is Not Registered!" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Password!" });
    }

    // generateToken(res, userExists._id);

    const userId = user._id;
    const tokenData = {
      userId,
    };

    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    console.log("token 134", token);

    // console.log("cookie token", res.cookie());

    // userExists.lastLogin = new Date();

    // await userExists.save();

    // return res.cookie("token", token, {
    //   httpOnly: true,
    //   maxAge: 1000 * 60 * 60 * 24 * 7,
    //   sameSite: "strict",
    // });

    // return res.status(200).json({
    //   success: true,
    //   message: "User logged in successfully",
    //   userExists: {
    //     ...userExists._doc,
    //     password: undefined,
    //   },
    // });

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        user,
        token,
        success: true,
      });
  } catch (error) {
    throw new Error(error);
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
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    // update password
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    return res.status(400).json({
      success: false,
      from: "catch",
      message: error.message,
    });
  }
};

// ===========================================================================================================

const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in checkAuth ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// ===========================================================================================================

export {
  signup,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
};
