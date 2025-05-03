import express from "express";

import productCtrl from "../controllers/productCtrl.js";
import productValidator from "../utils/validators/productValidator.js";
import verifyToken from "../middlewares/verifyToken.js";
import authorizeRoles from "../middlewares/role.js";

const router = express.Router();

router
  .route("/")
  .get(productCtrl.getProducts)
  .post(
    verifyToken,
    authorizeRoles("admin", "manager"),
    productCtrl.uploadProductImages,
    productCtrl.resizeProductImage,
    productValidator.createProductValidator,
    productCtrl.createProduct
  );

router
  .route("/:id")
  .get(productValidator.getProductValidator, productCtrl.getProduct)
  .put(
    verifyToken,
    authorizeRoles("admin", "manager"),
    productCtrl.uploadProductImages,
    productCtrl.resizeProductImage,
    productValidator.updateProductValidator,
    productCtrl.updateProduct
  )
  .delete(
    verifyToken,
    authorizeRoles("admin"),
    productValidator.deleteProductValidator,
    productCtrl.deleteProduct
  );

export default router;
