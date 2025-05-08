import { Secret } from "jsonwebtoken";
import config from "../../../config";
import { jwtHelpers } from "../../../helpars/jwtHelpers";
import prisma from "../../../shared/prisma";
import * as bcrypt from "bcrypt";
import ApiError from "../../../errors/ApiErrors";
import emailSender from "./emailSender";
import { UserStatus } from "@prisma/client";
import httpStatus from "http-status";

// user login
const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!userData?.email) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "User not found! with this email " + payload.email
    );
  }
  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Password incorrect!");
  }
  const accessToken = jwtHelpers.generateToken(
    {
      id: userData.id,
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  return { token: accessToken };
};



// change password

const changePassword = async (
  userToken: string,
  newPassword: string,
  oldPassword: string
) => {
  const decodedToken = jwtHelpers.verifyToken(
    userToken,
    config.jwt.jwt_secret!
  );

  const user = await prisma.user.findUnique({
    where: { id: decodedToken?.id },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await bcrypt.compare(oldPassword, user?.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Incorrect old password");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  const result = await prisma.user.update({
    where: {
      id: decodedToken.id,
    },
    data: {
      password: hashedPassword,
    },
  });
  return { message: "Password changed successfully" };
};

const forgotPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });

  const resetPassToken = jwtHelpers.generateToken(
    { email: userData.email, role: userData.role, id: userData.id },
    config.jwt.reset_pass_secret as Secret,
    config.jwt.reset_pass_token_expires_in as string
  );

  const resetPassLink =
    config.reset_pass_link + `?userId=${userData.id}&token=${resetPassToken}`;
 

  await emailSender(
    "Reset Your Password",
    userData.email,
    `
     <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <p>Dear ${userData.firstName},</p>
          
          <p>We received a request to reset your password. Click the button below to reset your password:</p>
          
          <a href="${resetPassLink}" style="text-decoration: none;">
            <button style="background-color: #007BFF; color: white; padding: 10px 20px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer;">
              Reset Password
            </button>
          </a>
          
          <p>If you did not request a password reset, please ignore this email or contact support if you have any concerns.</p>
          
          <p>Thank you,<br>Dream 2 Drive</p>
</div>

      `
  );
  return { message: "Reset password link sent via your email successfully" };
};

// reset password
const resetPassword = async (token: string, payload: { password: string }) => {
  const isValidToken = jwtHelpers.verifyToken(
    token,
    config.jwt.reset_pass_secret as Secret
  );

  if (!isValidToken) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden!");
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: isValidToken.id,
    },
  });

  // hash password
  const password = await bcrypt.hash(payload.password, 12);

  // update into database
  await prisma.user.update({
    where: {
      id: userData.id,
    },
    data: {
      password,
    },
  });
  return { message: "Password reset successfully" };
};

export const AuthServices = {
  loginUser,

  changePassword,
  forgotPassword,
  resetPassword,
};
