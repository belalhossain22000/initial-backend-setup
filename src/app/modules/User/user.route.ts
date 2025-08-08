import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

// register user
router.post(
  "/register",
  validateRequest(UserValidation.CreateUserValidationSchema),
  userController.createUser
);

//get my profile
router.get(
  "/profile",
  auth(),
  userController.getMyProfile
);
// get all  user
router.get("/", userController.getUsers);

//get user by id
router.get("/:id", userController.getUserById);



// profile user
router.put(
  "/profile",
  validateRequest(UserValidation.userUpdateSchema),
  auth(),
  userController.updateProfile
);

// update  user
router.put("/:id", userController.updateUser);

export const userRoutes = router;
