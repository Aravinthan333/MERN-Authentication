import express from "express";
import {
  forgotPassword,
  login,
  logout,
  signup,
  verifyEmail,
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

authRouter.post("/verifyEmail", verifyEmail);
authRouter.post("/forgot-password", forgotPassword);

export default authRouter;
