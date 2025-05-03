import express from "express";

import categoryCtrl from "../controllers/categoryCtrl.js";
import categoryValidator from "../utils/validators/categoryValidator.js";
import subCategoryRouter from "./subCategoryRoutes.js";
import verifyToken from "../middlewares/verifyToken.js";
import authorizeRoles from "../middlewares/role.js";

const router = express.Router();

router.use("/:categoryId/subcategories", subCategoryRouter);

router
  .route("/")
  .get(categoryCtrl.getCategories)
  .post(
    verifyToken,
    authorizeRoles("admin", "manager"),
    categoryCtrl.uploadCategoryImage,
    categoryCtrl.resizeImage,
    categoryValidator.createCategoryValidator,
    categoryCtrl.createCategory
  );

router
  .route("/:id")
  .get(categoryValidator.getCategoryValidator, categoryCtrl.getCategory)
  .put(
    verifyToken,
    authorizeRoles("admin", "manager"),
    categoryCtrl.uploadCategoryImage,
    categoryCtrl.resizeImage,
    categoryValidator.updateCategoryValidator,
    categoryCtrl.updateCategory
  )
  .delete(
    verifyToken,
    authorizeRoles("admin"),
    categoryValidator.deleteCategoryValidator,
    categoryCtrl.deleteCategory
  );

export default router;
