import { UserRole, UserStatus } from "@prisma/client";

export interface IUser {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: UserRole;
  profession:string;
  promoCode:string;
  status: UserStatus;
  isDeleted:boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type IUserFilterRequest = {
  name?: string | undefined;
  email?: string | undefined;
  contactNumber?: string | undefined;
  searchTerm?: string | undefined;
}