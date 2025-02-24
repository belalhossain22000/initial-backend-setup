import { UserRole } from "@prisma/client";
import prisma from "../../shared/prisma";
import config from "../../config";
import * as bcrypt from "bcrypt";

export const initiateSuperAdmin = async () => {
  const payload: any = {
    name: "Super",
    username: "Admin",
    email: "belalhossain22000@gmail.com",
    phoneNumber: "1234567890",
    role: UserRole.SUPER_ADMIN,
  };
  const hashedPassword: string = await bcrypt.hash(
    "12345678",
    Number(config.bcrypt_salt_rounds)
  );

  const isExistUser = await prisma.user.findUnique({
    where: {
      username: payload.username,
      email: payload.email,
    },
  });

  if (isExistUser) return;

  await prisma.user.create({
    data: { ...payload, password: hashedPassword },
  });
};
