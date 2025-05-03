import express from "express";

import brandCtrl from "../controllers/brandCtrl.js";
import brandValidator from "../utils/validators/brandValidator.js";
import verifyToken from "../middlewares/verifyToken.js";
import authorizeRoles from "../middlewares/role.js";

const router = express.Router();

router
  .route("/")
  .get(brandCtrl.getBrands)
  .post(
    verifyToken,
    authorizeRoles("admin", "manager"),
    brandCtrl.uploadBrandImage,
    brandCtrl.resizeImage,
    brandValidator.createBrandValidator,
    brandCtrl.createBrand
  );

router
  .route("/:id")
  .get(brandValidator.getBrandValidator, brandCtrl.getBrand)
  .put(
    verifyToken,
    authorizeRoles("admin", "manager"),
    brandCtrl.uploadBrandImage,
    brandCtrl.resizeImage,
    brandValidator.updateBrandValidator,
    brandCtrl.updateBrand
  )
  .delete(
    verifyToken,
    authorizeRoles("admin"),
    brandValidator.deleteBrandValidator,
    brandCtrl.deleteBrand
  );

export default router;
