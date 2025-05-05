import express from "express";

import userCtrl from "../controllers/userCtrl.js";
import adminValidator from "../utils/validators/adminValidator.js";
import userValidator from "../utils/validators/userValidator.js";
import verifyToken from "../middlewares/verifyToken.js";
import authorizeRoles from "../middlewares/role.js";
import reviewRouter from "./reviewRoutes.js";

const router = express.Router();

router.use("/:userId/reviews", reviewRouter);

router.get(
  "/get-me",
  verifyToken,
  userCtrl.getLoggedUserData,
  userCtrl.getUser
);

router.put(
  "/change-my-password",
  verifyToken,
  userValidator.changePasswordValidator,
  userCtrl.changeLoggedUserPassword
);

router.put(
  "/update-my-data",
  verifyToken,
  userValidator.updateUserValidator,
  userCtrl.updateLoggedUserData
);

router.delete("/delete-me", verifyToken, userCtrl.deleteLoggedUserData);

router.put(
  "/change-password/:id",
  verifyToken,
  authorizeRoles("admin", "manager"),
  adminValidator.changePasswordValidator,
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
    adminValidator.createUserValidator,
    userCtrl.createUser
  );

router
  .route("/:id")
  .get(adminValidator.getUserValidator, userCtrl.getUser)
  .put(
    verifyToken,
    authorizeRoles("admin", "manager"),
    userCtrl.uploadUserImage,
    userCtrl.resizeImage,
    adminValidator.updateUserValidator,
    userCtrl.updateUser
  )
  .delete(
    verifyToken,
    authorizeRoles("admin"),
    adminValidator.deleteUserValidator,
    userCtrl.deleteUser
  );

export default router;
