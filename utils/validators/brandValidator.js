import { check } from "express-validator";
import slugify from "slugify";

import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

// Validator for Get Brand by ID
export const getBrandValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid brand ID format.")
    .notEmpty()
    .withMessage("Brand ID is required."),
  validatorMiddleware,
];

// Validator for Create Brand
export const createBrandValidator = [
  check("name")
    .isString()
    .withMessage("Brand name must be a string.")
    .notEmpty()
    .withMessage("Brand name is required.")
    .isLength({ min: 2, max: 32 })
    .withMessage("Brand name must be between 2 and 32 characters.")
    .custom((name, { req }) => {
      req.body.slug = slugify(name);
      return true;
    }),
  validatorMiddleware,
];

// Validator for Update Brand
export const updateBrandValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid brand ID format.")
    .notEmpty()
    .withMessage("Brand ID is required."),
  check("name")
    .optional()
    .isString()
    .withMessage("Brand name must be a string.")
    .isLength({ min: 2, max: 32 })
    .withMessage("Brand name must be between 2 and 32 characters.")
    .custom((name, { req }) => {
      req.body.slug = slugify(name);
      return true;
    }),
  validatorMiddleware,
];

// Validator for Delete Brand
export const deleteBrandValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid brand ID format.")
    .notEmpty()
    .withMessage("Brand ID is required."),
  validatorMiddleware,
];

const brandValidator = {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
};

export default brandValidator;
