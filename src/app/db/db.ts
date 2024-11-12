import { UserRole } from "@prisma/client";
import prisma from "../../shared/prisma";

export const initiateSuperAdmin = async () => {
  const payload: any = {
    name: "Super",
    username: "Admin",
    email: "belalhossain22000@gmail.com",
    phoneNumber: "1234567890",
    password: "123456",
    role: UserRole.SUPER_ADMIN,
  };

  const isExistUser = await prisma.user.findUnique({
    where: {
      username: payload.username,
      email: payload.email,
    },
  });

  if (isExistUser) return;

  await prisma.user.create({
    data: payload,
  });
};
