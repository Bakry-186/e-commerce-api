import crypto from "crypto";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import ApiError from "../utils/apiError.js";
import { sendEmail } from "../utils/sendEmail.js";

// @desc Signup
// @route POST /api/v1/auth/signup
// @access Public
export const signup = asyncHandler(async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  res.status(201).json({ data: newUser });
});

// @desc Login
// @route POST /api/v1/auth/login
// @access Public
export const login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Incorrect email or password.", 401));
  }

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET_ACCESS_KEY,
    { expiresIn: "7d" }
  );

  res.status(200).json({ data: user, token });
});

// @desc Forgot password
// @route POST /api/v1/auth/forgot-password
// @access Public
export const forgotPassword = asyncHandler(async (req, res, next) => {
  // Get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError(`No user for this email ${req.body.email}`, 404));
  }

  // if user exist, generate hash reset random 6 digit and save it in DB
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  // Save hashed password reset code in DB
  user.PasswordResetCode = hashedResetCode;
  user.PasswordResetExpires = Date.now() + 5 * 60 * 1000;
  user.PasswordResetVerifeid = false;

  await user.save();

  //Send the reset code via email
  const message = `Hi ${user.name},\n We received a request to reset the password on your E-shop Account.<h1> \n ${resetCode} </h1> \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The E-shop Team`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code (valid for 5 min)",
      message,
    });
  } catch (err) {
    user.PasswordResetCode = undefined;
    user.PasswordResetExpires = undefined;
    user.PasswordResetVerifeid = undefined;

    await user.save();
    return next(new ApiError("There is err in sending email.", 500));
  }

  res
    .status(200)
    .json({ status: "Success", message: "Reset code sent to email." });
});

export const verifiyPassResetCode = asyncHandler(async (req, res, next) => {
  // Get user based on reset code
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode.toString())
    .digest("hex");

  const user = await User.findOne({
    PasswordResetCode: hashedResetCode,
    PasswordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("Reset code is invalid or expired!"));
  }

  // Valid reset code
  user.PasswordResetVerifeid = true;
  await user.save();

  res.status(200).json({ message: "Code verified, you may reset password" });
});

export const resetPassword= asyncHandler(async (req, res, next) => {
  // Get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError(`No user for this email ${req.body.email}`, 404));
  }

  // Check if reset code verified
  if (!user.PasswordResetVerifeid) {
    return next(new ApiError("Reset code not verified!", 400));
  }

  user.password = req.body.newPassword;
  user.PasswordResetCode = undefined;
  user.PasswordResetExpires = undefined;
  user.PasswordResetVerifeid = undefined;

  await user.save();

  // Generate token
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET_ACCESS_KEY,
    { expiresIn: "7d" }
  );

  res.status(200).json({ token });
});

const authCtrl = { signup, login, forgotPassword, verifiyPassResetCode, resetPassword };
export default authCtrl;
