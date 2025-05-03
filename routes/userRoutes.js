import express from "express";

import userCtrl from "../controllers/userCtrl.js";
import userValidator from "../utils/validators/userValidator.js";
import verifyToken from "../middlewares/verifyToken.js";
import authorizeRoles from "../middlewares/role.js";

const router = express.Router();

router.put(
  "/change-password/:id",
  userValidator.changePasswordValidator,
  userCtrl.changePassword
);

router
  .route("/")
  .get(userCtrl.getUsers)
  .post(
    userCtrl.uploadUserImage,
    userCtrl.resizeImage,
    userValidator.createUserValidator,
    userCtrl.createUser
  );

router
  .route("/:id")
  .get(userValidator.getUserValidator, userCtrl.getUser)
  .put(
    userCtrl.uploadUserImage,
    userCtrl.resizeImage,
    userValidator.updateUserValidator,
    userCtrl.updateUser
  )
  .delete(userValidator.deleteUserValidator, userCtrl.deleteUser);

export default router;
