import { check } from "express-validator";
import slugify from "slugify";

import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

// Validator for Get SubCategory by ID
export const getSubCategoryValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid SubCategory ID format.")
    .notEmpty()
    .withMessage("SubCategory ID is required."),
  validatorMiddleware,
];

// Validator for Create SubCategory
export const createSubCategoryValidator = [
  check("name")
    .isString()
    .withMessage("SubCategory name must be a string.")
    .notEmpty()
    .withMessage("SubCategory name is required.")
    .isLength({ min: 2, max: 32 })
    .withMessage("SubCategory name must be between 2 and 32 characters.")
    .custom((name, { req }) => {
      req.body.slug = slugify(name);
      return true;
    }),
  check("category")
    .isMongoId()
    .withMessage("Invalid category ID format.")
    .notEmpty()
    .withMessage("Category ID is required."),
  validatorMiddleware,
];

// Validator for Update SubCategory
export const updateSubCategoryValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid SubCategory ID format.")
    .notEmpty()
    .withMessage("SubCategory ID is required."),
  check("name")
    .optional()
    .isString()
    .withMessage("SubCategory name must be a string.")
    .isLength({ min: 2, max: 32 })
    .withMessage("SubCategory name must be between 2 and 32 characters.")
    .custom((name, { req }) => {
      req.body.slug = slugify(name);
      return true;
    }),
  check("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid category ID format."),
  validatorMiddleware,
];

// Validator for Delete SubCategory
export const deleteSubCategoryValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid SubCategory ID format.")
    .notEmpty()
    .withMessage("SubCategory ID is required."),
  validatorMiddleware,
];

const subCategoryValidator = {
  getSubCategoryValidator,
  createSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
};

export default subCategoryValidator;
