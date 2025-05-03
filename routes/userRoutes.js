import express from "express";

import userCtrl from "../controllers/userCtrl.js";
import userValidator from "../utils/validators/userValidator.js";
import verifyToken from "../middlewares/verifyToken.js";
import authorizeRoles from "../middlewares/role.js";

const router = express.Router();

router.get(
  "/get-me",
  verifyToken,
  userCtrl.getLoggedUserData,
  userCtrl.getUser
);

router.put(
  "/change-password/:id",
  verifyToken,
  authorizeRoles("admin", "manager"),
  userValidator.changePasswordValidator,
  userCtrl.changePassword
);

router
  .route("/")
  .get(userCtrl.getUsers)
  .post(
    verifyToken,
    authorizeRoles("admin", "manager"),
    userCtrl.uploadUserImage,
    userCtrl.resizeImage,
    userValidator.createUserValidator,
    userCtrl.createUser
  );

router
  .route("/:id")
  .get(userValidator.getUserValidator, userCtrl.getUser)
  .put(
    verifyToken,
    authorizeRoles("admin", "manager"),
    userCtrl.uploadUserImage,
    userCtrl.resizeImage,
    userValidator.updateUserValidator,
    userCtrl.updateUser
  )
  .delete(
    verifyToken,
    authorizeRoles("admin"),
    userValidator.deleteUserValidator,
    userCtrl.deleteUser
  );

export default router;
