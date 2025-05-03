import { check } from "express-validator";
import slugify from "slugify";
import bcrypt from "bcrypt";

import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import User from "../../models/userModel.js";

// Validator for Get User by ID
export const getUserValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid user ID format.")
    .notEmpty()
    .withMessage("User ID is required."),
  validatorMiddleware,
];

// Validator for Create User
export const createUserValidator = [
  check("name")
    .isString()
    .withMessage("User name must be a string.")
    .notEmpty()
    .withMessage("User name is required.")
    .isLength({ min: 2, max: 32 })
    .withMessage("User name must be between 2 and 32 characters.")
    .custom((name, { req }) => {
      req.body.slug = slugify(name);
      return true;
    }),

  check("email")
    .isEmail()
    .withMessage("Invalid email format.")
    .notEmpty()
    .withMessage("Email is required.")
    .custom(async (email) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("Email already exist.");
      }
    }),

  check("password")
    .isString()
    .withMessage("Password must be a string.")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long.")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("Password confirmation is not correct.");
      }
      return true;
    }),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirm is required."),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only Egyptian and Saudian number."),

  check("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Role must be either 'user' or 'admin'."),

  validatorMiddleware,
];

// Validator for Update User
export const updateUserValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid user ID format.")
    .notEmpty()
    .withMessage("User ID is required."),

  check("name")
    .optional()
    .isString()
    .withMessage("User name must be a string.")
    .isLength({ min: 2, max: 32 })
    .withMessage("User name must be between 2 and 32 characters.")
    .custom((name, { req }) => {
      req.body.slug = slugify(name);
      return true;
    }),

  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email format.")
    .custom(async (email) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("Email already exist.");
      }
    }),

  check("password")
    .optional()
    .isString()
    .withMessage("Password must be a string.")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only Egyptian and Saudian number."),

  check("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Role must be either 'user' or 'admin'."),

  validatorMiddleware,
];

// Validator for Change Password
export const changePasswordValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid user ID format.")
    .notEmpty()
    .withMessage("User ID is required."),

  check("currentPassword")
    .notEmpty()
    .withMessage("Current password is required."),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirm is required."),

  check("password")
    .notEmpty()
    .withMessage("Password is required.")
    .custom(async (password, { req }) => {
      // Verify current password
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error("User not found.");
      }

      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("Incorrect current password.");
      }

      // Verify password confirm
      if (password !== req.body.passwordConfirm) {
        throw new Error("Incorrect confirmation password.");
      }
      return true;
    }),
  validatorMiddleware,
];

// Validator for Delete User
export const deleteUserValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid user ID format.")
    .notEmpty()
    .withMessage("User ID is required."),
  validatorMiddleware,
];

const userValidator = {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changePasswordValidator,
};

export default userValidator;
