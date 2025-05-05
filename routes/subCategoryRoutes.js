import express from "express";

import subCategoryCtrl from "../controllers/subCategoryCtrl.js";
import subCategoryValidator from "../utils/validators/subCategoryValidator.js";
import verifyToken from "../middlewares/verifyToken.js";
import authorizeRoles from "../middlewares/role.js";

// Allow us to access params that we received from other routers
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(subCategoryCtrl.createFilterObj, subCategoryCtrl.getSubCategories)
  .post(
    verifyToken,
    authorizeRoles("admin", "manager"),
    subCategoryCtrl.setCategoryIdToBody,
    subCategoryValidator.createSubCategoryValidator,
    subCategoryCtrl.createSubCategory
  );

router
  .route("/:id")
  .get(
    subCategoryValidator.getSubCategoryValidator,
    subCategoryCtrl.getSubCategory
  )
  .put(
    verifyToken,
    authorizeRoles("admin", "manager"),
    subCategoryValidator.updateSubCategoryValidator,
    subCategoryCtrl.updateSubCategory
  )
  .delete(
    verifyToken,
    authorizeRoles("admin"),
    subCategoryValidator.deleteSubCategoryValidator,
    subCategoryCtrl.deleteSubCategory
  );

export default router;
