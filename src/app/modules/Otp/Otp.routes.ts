// Otp.routes: Module file for the Otp.routes functionality.
import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { OtpController } from "./Otp.controller";
import { OtpValidation } from "./Otp.validation";

const router = express.Router();

router.post(
  "/verify",
  validateRequest(OtpValidation.verifyOtpSchema),
  OtpController.verifyOtp
);

router.post(
  "/send",
  validateRequest(OtpValidation.sendOtpSchema),
  OtpController.sendOtp
);

export const OtpRoutes = router;