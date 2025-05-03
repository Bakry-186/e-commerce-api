import { check } from "express-validator";
import slugify from "slugify";

import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

// Validator for Get Category by ID
export const getCategoryValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid category ID format.")
    .notEmpty()
    .withMessage("Category ID is required."),
  validatorMiddleware,
];

// Validator for Create Category
export const createCategoryValidator = [
  check("name")
    .isString()
    .withMessage("Category name must be a string.")
    .notEmpty()
    .withMessage("Category name is required.")
    .isLength({ min: 3, max: 32 })
    .withMessage("Category name must be between 3 and 32 characters.")
    .custom((name, { req }) => {
      req.body.slug = slugify(name);
      return true;
    }),
  validatorMiddleware,
];

// Validator for Update Category
export const updateCategoryValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid category ID format.")
    .notEmpty()
    .withMessage("Category ID is required."),
  check("name")
    .optional()
    .isString()
    .withMessage("Category name must be a string.")
    .isLength({ min: 3, max: 32 })
    .withMessage("Category name must be between 3 and 32 characters.")
    .custom((name, { req }) => {
      req.body.slug = slugify(name);
      return true;
    }),
  validatorMiddleware,
];

// Validator for Delete Category
export const deleteCategoryValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid category ID format.")
    .notEmpty()
    .withMessage("Category ID is required."),
  validatorMiddleware,
];

const categoryValidator = {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
};

export default categoryValidator;
