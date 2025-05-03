import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError.js";
import User from "../models/userModel.js";

export const verifyToken = async (req, res, next) => {
  // Check if token exist
  if (!req.headers.authorization) {
    next(new ApiError("No access token", 401));
  }

  const token = req.headers.authorization.split(" ")[1];

  // Verify token
  const decode = jwt.verify(token, process.env.JWT_SECRET_ACCESS_KEY);

  // Check if user exits
  const user = await User.findById(decode.userId);
  if (!user) {
    next(new ApiError("User no longer exists", 401));
  }

  // Check if user changed his password after token generated
  if (user.passwordChangedAt > decode.iat * 1000) {
    next(new ApiError("Password recently changed. Please log in again.", 401));
  }

  req.user = user;
  next();
};

export default verifyToken;
