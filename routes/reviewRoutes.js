import express from "express";

import {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  setProductIdAndUserIdToBody,
  createFilterObj,
  getUserReviews,
} from "../controllers/reviewCtrl.js";

import {
  getReviewValidator,
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
  getReviewsValidator,
} from "../utils/validators/reviewValidator.js";

import verifyToken from "../middlewares/verifyToken.js";
import authorizeRoles from "../middlewares/role.js";

const router = express.Router({ mergeParams: true });

// Get current user's reviews
router.get(
  "/get-my-reviews",
  verifyToken,
  authorizeRoles("user"),
  getUserReviews
);

// Routes for /api/v1/reviews and /api/v1/products/:productId/reviews
router
  .route("/")
  .get(createFilterObj, getReviewsValidator, getReviews)
  .post(
    verifyToken,
    authorizeRoles("user"),
    setProductIdAndUserIdToBody,
    createReviewValidator,
    createReview
  );

// Routes for /api/v1/reviews/:id
router
  .route("/:id")
  .get(
    verifyToken,
    authorizeRoles("user", "admin", "manager"),
    getReviewValidator,
    getReview
  )
  .put(
    verifyToken,
    authorizeRoles("user"),
    updateReviewValidator,
    updateReview
  )
  .delete(
    verifyToken,
    authorizeRoles("user", "admin", "manager"),
    deleteReviewValidator,
    deleteReview
  );

export default router;
