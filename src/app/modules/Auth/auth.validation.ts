import { z } from "zod";

const changePasswordValidationSchema = z.object({
  oldPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

export const authValidation={
    changePasswordValidationSchema
}