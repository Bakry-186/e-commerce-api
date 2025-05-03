import express from "express";

import authCtrl from "../controllers/authCtrl.js";
import authValidator from "../utils/validators/authValidator.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/signup", authValidator.signupValidator, authCtrl.signup);
router.post("/login", authValidator.loginValidator, authCtrl.login);
router.post("/logout",verifyToken, authCtrl.logout);

router.post(
  "/forgot-password",
  authValidator.forgotPasswordValidator,
  authCtrl.forgotPassword
);
router.post(
  "/verify-reset-code",
  authValidator.resetCodeValidator,
  authCtrl.verifiyPassResetCode
);

router.put(
  "/reset-password",
  authValidator.resetPasswordValidator,
  authCtrl.resetPassword
);

export default router;
