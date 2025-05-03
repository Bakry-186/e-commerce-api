import ApiError from "../utils/apiError.js";

const sendErrorForDev = (error, res) => {
  return res.status(error.statusCode).json({
    status: error.status,
    error,
    message: error.message,
    stack: error.stack,
  });
};

const handleJwtInvalidSignature = () =>
  new ApiError("Invalid token, please try again.", 401);

const handleJwtExpired = () =>
  new ApiError("Expired token, please try again.", 401);

const sendErrorForProd = (error, res) => {
  return res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
};

const globalError = (error, req, res, next) => {
  error.statusCode = error.statusCode || 400;
  if (process.env.NODE_ENV === "development") {
    sendErrorForDev(error, res);
  } else {
    if ((error.name = "JsonWebTokenError")) error = handleJwtInvalidSignature();
    if ((error.name = "TokenExpiredError")) error = handleJwtExpired();
    sendErrorForProd(error, res);
  }
};

export default globalError;
