import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import { IUser, IUserFilterRequest } from "./user.interface";
import * as bcrypt from "bcrypt";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { Prisma, User, UserRole } from "@prisma/client";
import { userSearchAbleFields } from "./user.costant";
import config from "../../../config";
import httpStatus from "http-status";
import setupAccount from "../../../emailTemplate/setupAccount";
import emailSender from "../../../shared/emailSernder";
import crypto from "crypto";

// Create a new user in the database.
const createUserIntoDb = async (payload: User) => {
  // 1️⃣ Check existing user
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `User with this email ${payload.email} already exists`
    );
  }

  // 2️⃣ Generate secure invite token
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  const tokenExpiry = new Date();
  tokenExpiry.setHours(tokenExpiry.getHours() + 24); // 24h expiry

  // 3️⃣ Create user WITHOUT password
  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      role: payload.role,
      location: payload.location,
      expertise: payload.expertise ?? [],
      notes: payload.notes,

      password: null,
      resetToken: hashedToken,
      resetExpires: tokenExpiry,
      inviteSentAt: new Date(),
      inviteCount: 1,
      isPasswordChanged: false,
    },
  });

  if (!user) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to create user"
    );
  }

  // 4️⃣ Send invitation email
  const inviteLink = `${config.set_pass_link}/set-password?token=${rawToken}`;

  await emailSender(
    "Set up your account",
    user.email,
    setupAccount(inviteLink)
  );

  return user;
};

// reterive all users from the database also searcing anf filetering
const getUsersFromDb = async (
  params: IUserFilterRequest,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.UserWhereInput[] = [];

  if (params.searchTerm) {
    andConditions.push({
      OR: userSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }
  const whereConditions: Prisma.UserWhereInput = { AND: andConditions };

  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });
  const total = await prisma.user.count({
    where: whereConditions,
  });

  if (!result || result.length === 0) {
    throw new ApiError(404, "No active users found");
  }
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

//get user byid
const getUserById = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  if (!result) {
    throw new ApiError(404, "User not found");
  }
  return result;
};

// get user profile
const getMyProfile = async (userId: string) => {
  const userProfile = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  return userProfile;
};

// update profile by user won profile uisng token or email and id
const updateProfile = async (user: IUser, payload: User) => {
  const userInfo = await prisma.user.findUnique({
    where: {
      email: user.email,
      id: user.id,
    },
  });

  if (!userInfo) {
    throw new ApiError(404, "User not found");
  }

  // Update the user profile with the new information
  const result = await prisma.user.update({
    where: {
      email: userInfo.email,
    },
    data: payload,
  });

  if (!result)
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to update user profile"
    );

  return result;
};

// update user data into database by id fir admin
const updateUserIntoDb = async (payload: IUser, id: string) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      id: id,
    },
  });
  if (!userInfo)
    throw new ApiError(httpStatus.NOT_FOUND, "User not found with id: " + id);

  const result = await prisma.user.update({
    where: {
      id: userInfo.id,
    },
    data: payload,
  });

  if (!result)
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to update user profile"
    );

  return result;
};

const resendUserInvite = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.isPasswordChanged) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User already activated");
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  const expiry = new Date();
  expiry.setHours(expiry.getHours() + 24);

  await prisma.user.update({
    where: { id: userId },
    data: {
      resetToken: hashedToken,
      resetExpires: expiry,
      inviteSentAt: new Date(),
      inviteCount: { increment: 1 },
    },
  });

  const inviteLink = `${config.set_pass_link}/set-password?token=${rawToken}`;

  await emailSender(
    "Your invitation link",
    user.email,
    `<p>Click here to set your password:</p><a href="${inviteLink}">${inviteLink}</a>`
  );
};


export const userService = {
  createUserIntoDb,
  getUsersFromDb,
  getUserById,
  updateProfile,
  updateUserIntoDb,
  getMyProfile,
  resendUserInvite
};
