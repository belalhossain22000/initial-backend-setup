import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthController } from "./auth.controller";
import { UserValidation } from "../User/user.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { authValidation } from "./auth.validation";

const router = express.Router();

// user login route
router.post(
  "/login",
  validateRequest(UserValidation.UserLoginValidationSchema),
  AuthController.loginUser
);

// user logout route
router.post("/logout", AuthController.logoutUser);


router.put(
  "/change-password",
  auth(),
  validateRequest(authValidation.changePasswordValidationSchema),
  AuthController.changePassword
);


router.post(
  '/forgot-password',
  AuthController.forgotPassword
);

router.post(
  '/reset-password',
  AuthController.resetPassword
)

export const AuthRoutes = router;
