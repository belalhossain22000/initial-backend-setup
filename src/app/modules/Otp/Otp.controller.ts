// Otp.controller: Module file for the Otp.controller functionality.
import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { OtpService } from "./Otp.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const verifyOtp = catchAsync(async (req: Request, res: Response) => {
  const result = await OtpService.verifyOtp(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

const sendOtp = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  const result = await OtpService.sendOtp(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

export const OtpController = {
  verifyOtp,
  sendOtp,
};
