import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError.js";
import User from "../models/userModel.js";

export const verifyToken = async (req, res, next) => {
  // Check if token exists in header or cookies
  const token =
    req.headers.authorization?.split(" ")[1] ||
    req.cookies.Authorization?.split(" ")[1];

  if (!token) {
    return next(new ApiError("No access token", 401));
  }

  // Verify token
  const decode = jwt.verify(token, process.env.JWT_SECRET_ACCESS_KEY);

  // Check if user exist
  const user = await User.findById(decode.userId);
  if (!user) {
    return next(new ApiError("User no longer exists", 401));
  }

  // Check if user changed his password after token generated
  if (user.passwordChangedAt > decode.iat * 1000) {
    return next(
      new ApiError("Password recently changed. Please log in again.", 401)
    );
  }

  req.user = user;
  next();
};

export default verifyToken;
