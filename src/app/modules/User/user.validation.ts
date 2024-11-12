import { z } from "zod";



const CreateUserValidationSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .min(1, "Email is required"),  // Ensure email is provided and is valid

  name: z
    .string()
    .min(1, "Name is required"),  // Ensure name is non-empty

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .nonempty("Password is required"),

});

export { CreateUserValidationSchema };
;

const UserLoginValidationSchema = z.object({
  email: z.string().email().nonempty("Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .nonempty("Password is required"),
});

const userUpdateSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  promoCode: z.string().optional(),
  profession: z.string().optional(),
});

export const UserValidation = {
  CreateUserValidationSchema,
  UserLoginValidationSchema,
  userUpdateSchema,
};
