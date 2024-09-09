import bcrypt from "bcryptjs";

import { User } from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";

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

const login = async (req, res) => {};

// ===========================================================================================================

const logout = async (req, res) => {};

// ===========================================================================================================

export { signup, login, logout };
