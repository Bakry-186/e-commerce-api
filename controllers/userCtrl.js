import asyncHandler from "express-async-handler";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import bcrypt from "bcrypt";

import factory from "../utils/handlerFactory.js";
import { uploadSingleImage } from "../middlewares/uploadImageMiddleware.js";
import User from "../models/userModel.js";

// Upload single image
export const uploadUserImage = uploadSingleImage("profileImg");

// Image processing
export const resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/users/${filename}`);

  // Save image in DB
  req.body.profileImg = filename;

  next();
});

// export const setUserIdToBody = (req, res, next) => {
//   if (!req.body.user) req.body.user = req.user._id;
//   next();
// };

// @desc Get list of users
// @route GET /api/v1/users
// @access Private/Admin
export const getUsers = factory.getAll(User);

// @desc Get specific user by id
// @route GET /api/v1/users/:id
// @access Private/Admin
export const getUser = factory.getOne(User);

// @desc Create user
// @route POST /api/v1/users
// @access Private/Admin
export const createUser = factory.createOne(User);

// @desc Update specific user
// @route PUT /api/v1/users/:id
// @access Private/Admin
export const updateUser = asyncHandler(async (req, res, next) => {
  const doc = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      role: req.body.role,
      phone: req.body.phone,
      profileImg: req.body.profileImg,
    },
    {
      new: true,
    }
  );

  if (!doc) {
    return next(new ApiError("Document not found!", 404));
  }

  res.status(200).json({ data: doc });
});

// @desc Change specific user password
// @route PUT /api/v1/users/change-password/:id
// @access Public
export const changePassword = asyncHandler(async (req, res, next) => {
  const doc = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 10),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!doc) {
    return next(new ApiError("Document not found!", 404));
  }

  res.status(200).json({ data: doc });
});

// @desc Delete specific user
// @route DELETE /api/v1/users/:id
// @access Private/Admin
export const deleteUser = factory.deleteOne(User);

// @desc    Get Logged user data
// @route   GET /api/v1/users/getMe
// @access  Private/Protect
export const getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

export const changeLoggedUserPassword = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 10),
      passwordChangedAt: Date.now(),
    },
    { new: true }
  );

  res.clearCookie("Authorization").status(200).json({
    message: "Password changed successfully please login.",
  });
});

export const updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    { new: true }
  );

  res.status(200).json({ data: user });
});

export const deleteLoggedUserData = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.user._id);
});

const userCtrl = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  changePassword,
  getLoggedUserData,
  changeLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUserData,
  // setUserIdToBody,
};

export default userCtrl;
