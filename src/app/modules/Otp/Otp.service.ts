// Otp.service: Module file for the Otp.service functionality.

import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import httpStatus from "http-status";

import { emailVerification } from "../../../emailTemplate/emailVerification";
import generateOtp from "../../../helpars/generateOtp";
import emailSender from "../../../shared/emailSernder";

//verify otp
const verifyOtp = async (payload: { email: string; otp: number }) => {
  return await prisma.$transaction(async (tx) => {
    const otpData = await tx.otp.findFirst({
      where: {
        email: payload.email,
        isUsed: false,
      },
    });

    if (!otpData) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "OTP not found or has expired. Please request a new OTP."
      );
    }

    const currentTime = new Date();

    // Check expiration
    if (currentTime > otpData.expiresAt) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "OTP has expired. Please request a new OTP."
      );
    }

    // If OTP does not match, increment attempts
    if (otpData.otp !== payload.otp) {
      if (otpData.attempts + 1 >= otpData.maxAttempts) {
        // Invalidate OTP after max attempts reached
        await tx.otp.update({
          where: { id: otpData.id },
          data: {
            attempts: otpData.attempts + 1,
            isUsed: true,
          },
        });

        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "Maximum OTP attempts exceeded. Please request a new OTP."
        );
      }

      // Increment attempts count and allow retry
      await tx.otp.update({
        where: { id: otpData.id },
        data: { attempts: otpData.attempts + 1 },
      });

      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Invalid OTP. You have ${
          otpData.maxAttempts - (otpData.attempts + 1)
        } attempts left.`
      );
    }

    // Valid OTP: mark as used and reset otp to 0 for security
    await tx.otp.update({
      where: { id: otpData.id },
      data: {
        otp: 0,
        isUsed: true,
      },
    });

    await tx.user.update({
      where: {
        email: payload.email,
      },
      data: {
        isEmailVerified: true,
      },
    });

    return { message: "OTP verified successfully." };
  });
};

// resend otp
const sendOtp = async (email: string) => {
  const newOtp = generateOtp();

  await prisma.$transaction(async (prismaTx) => {
    await prismaTx.otp.create({
      data: {
        email,
        otp: newOtp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    // Sending email after DB operation succeeds
    await emailSender(
      "Verify Your Email Address",
      email,
      emailVerification(newOtp)
    );
  });

  return {
    message: "OTP has been resent to your email address and expires in 5 min.",
  };
};

export const OtpService = {
  verifyOtp,
  sendOtp,
};
