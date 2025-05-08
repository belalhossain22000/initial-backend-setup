import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { AuthServices } from "./auth.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { string } from "zod";

// login user
const loginUser = catchAsync(async (req: Request, res: Response) => {

  const result = await AuthServices.loginUser(req.body);
  res.cookie("token", result.token, { httpOnly: true });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully",
    data: result,
  });
});

// logout user
const logoutUser = catchAsync(async (req: Request, res: Response) => {
  // Clear the token cookie
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Successfully logged out",
    data: null,
  });
});



// change password
const changePassword = catchAsync(async (req: Request, res: Response) => {
  const userToken = req.headers.authorization;
  const { oldPassword, newPassword } = req.body;

  const result = await AuthServices.changePassword(
    userToken as string,
    newPassword,
    oldPassword
  );
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Password changed successfully",
    data: result,
  });
});


// forgot password
const forgotPassword = catchAsync(async (req: Request, res: Response) => {

  await AuthServices.forgotPassword(req.body);

  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Check your email!",
      data: null
  })
});


// reset password
const resetPassword = catchAsync(async (req: Request, res: Response) => {

  const token = req.headers.authorization || "";

  await AuthServices.resetPassword(token, req.body);

  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password Reset!",
      data: null
  })
});



export const AuthController = {
  loginUser,
  logoutUser,

  changePassword,
  forgotPassword,
  resetPassword
};
