// Otp.validation: Module file for the Otp.validation functionality.
import { z } from "zod";

const verifyOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z
    .number()
    .int()
    .min(100000, "OTP must be at least 6 digits")
    .max(999999, "OTP must be at most 6 digits"),
});

const sendOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const OtpValidation = {
  verifyOtpSchema,
  sendOtpSchema,
};
