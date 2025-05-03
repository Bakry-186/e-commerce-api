import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";

export const authorizeRoles = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError("Access Denied!", 403));
    }

    next();
  });

export default authorizeRoles;
