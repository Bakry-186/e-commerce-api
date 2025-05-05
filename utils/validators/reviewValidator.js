import { check, param } from "express-validator";
import asyncHandler from "express-async-handler";

import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import Review from "../../models/reviewModel.js";
import Product from "../../models/productModel.js";

export const getReviewsValidator = [
  param("productId")
    .optional()
    .isMongoId()
    .withMessage("Invalid product id format")
    .custom(
      asyncHandler(async (productId) => {
        const product = await Product.findById(productId);
        if (!product) {
          return Promise.reject(new Error("Product not found!"));
        }
      })
    ),
  validatorMiddleware,
];

// Validator for Get Review by ID
export const getReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review ID format.")
    .notEmpty()
    .withMessage("Review ID is required.")
    .custom(
      asyncHandler(async (id, { req }) => {
        if (req.user.role == "user") {
          const review = await Review.findById(id);
          if (!review) {
            return Promise.reject(new Error("Review not found!"));
          }

          if (review.user._id.toString() !== req.user._id.toString()) {
            return Promise.reject(
              new Error("You're not allowed to perform this action!")
            );
          }
        }
        return true;
      })
    ),
  validatorMiddleware,
];

// Validator for Create Review
export const createReviewValidator = [
  check("content").optional(),
  check("ratings")
    .notEmpty()
    .withMessage("Rating is required!")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5!"),

  check("user")
    .notEmpty()
    .withMessage("User is required")
    .isMongoId()
    .withMessage("Invalid user id format"),

  check("product")
    .notEmpty()
    .withMessage("Product is required")
    .isMongoId()
    .withMessage("Invalid product id format")
    .custom(
      asyncHandler(async (productId, { req }) => {
        const product = await Product.findById(productId);
        if (!product) {
          return Promise.reject(new Error("Product not found!"));
        }
        const review = await Review.findOne({
          user: req.user._id,
          product: productId,
        });
        if (review) {
          return Promise.reject(
            new Error("You already created a review before!")
          );
        }
        return true;
      })
    ),
  validatorMiddleware,
];

// Validator for Update Review
export const updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid review ID format.")
    .notEmpty()
    .withMessage("Review ID is required.")
    .custom(
      asyncHandler(async (id, { req }) => {
        const review = await Review.findById(id);
        if (!review) {
          return Promise.reject(new Error("Review not found!"));
        }

        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error("You're not allowed to perform this action!")
          );
        }
      })
    ),
  validatorMiddleware,
];

// Validator for Delete BRerand
export const deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid review ID format.")
    .notEmpty()
    .withMessage("Review ID is required.")
    .custom(
      asyncHandler(async (id, { req }) => {
        if (req.user.role == "user") {
          const review = await Review.findById(id);
          if (!review) {
            return Promise.reject(new Error("Review not found!"));
          }

          if (review.user._id.toString() !== req.user._id.toString()) {
            return Promise.reject(
              new Error("You're not allowed to perform this action!")
            );
          }
        }
        return true;
      })
    ),
  ,
  validatorMiddleware,
];
