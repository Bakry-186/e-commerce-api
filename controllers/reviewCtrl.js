import asyncHandler from "express-async-handler";

import factory from "../utils/handlerFactory.js";
import Review from "../models/reviewModel.js";

// Middleware to automatically set product and user ID in the request body
export const setProductIdAndUserIdToBody = (req, res, next) => {
  req.body.product ??= req.params.productId;
  req.body.user ??= req.user._id;
  next();
};

// Middleware to create a filter object if productId is present in the route
export const createFilterObj = (req, res, next) => {
  req.filterObject = req.params.productId ? { product: req.params.productId } : {};
  next();
};

// @desc    Get all reviews
// @route   GET /api/v1/reviews
// @access  Public
export const getReviews = factory.getAll(Review);

// @desc    Get a specific review by ID
// @route   GET /api/v1/reviews/:id
// @access  Public
export const getReview = factory.getOne(Review);

// @desc    Create a new review
// @route   POST /api/v1/reviews
// @access  Private (Admin/Manager)
export const createReview = factory.createOne(Review);

// @desc    Update a review
// @route   PUT /api/v1/reviews/:id
// @access  Private (Admin/Manager)
export const updateReview = factory.updateOne(Review);

// @desc    Delete a review
// @route   DELETE /api/v1/reviews/:id
// @access  Private (Admin/Manager)
export const deleteReview = factory.deleteOne(Review);

// @desc    Get logged-in user's reviews
// @route   GET /api/v1/reviews/get-my-reviews
// @access  Private (User)
export const getUserReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ user: req.user._id });
  res.status(200).json({ data: reviews });
});
