import path from "path";
import { fileURLToPath } from "url";

import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import "./config/connect.js"; // Connect with db
// Routes
import categoryRouter from "./routes/categoryRoutes.js";
import subCategoryRouter from "./routes/subCategoryRoutes.js";
import brandRouter from "./routes/brandRoutes.js";
import productRouter from "./routes/productRoutes.js";
import userRouter from "./routes/userRoutes.js";
import authRouter from "./routes/authRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";
import ApiError from "./utils/apiError.js";
import globalError from "./middlewares/errorMiddleware.js";

// express app
const app = express();

// Use fileURLToPath to get the current directory path
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

// Mount routes
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/subcategories", subCategoryRouter);
app.use("/api/v1/brands", brandRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);

app.all(/.*/, (req, res, next) => {
  // Create error and send it to error handling middleware
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 404));
});

// Global error handling middleware for express
app.use(globalError);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Handle rejections outside express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shuting down.....`);
    process.exit(1);
  });
});
