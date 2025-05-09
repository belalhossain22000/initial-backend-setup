// Image.routes: Module file for the Image.routes functionality.
import express from "express";
import { ImageController } from "./Image.controller";
import { fileUploader } from "../../../helpars/fileUploader";
import validateRequest from "../../middlewares/validateRequest";
import { ImageValidation } from "./Image.validation";

const router = express.Router();

// Create image route (POST)
router.post(
  "/single",
  fileUploader.upload.single("file"),
  ImageController.createImage
);


// Create image route (POST)
router.post(
  "/multiple",
  fileUploader.upload.array("files"),
  ImageController.createImages
);



// Delete image by ID route (DELETE)
router.delete("/delete", ImageController.deleteImage);



router.delete(
  "/bulk",
  validateRequest(ImageValidation.deleteMultipleImagesSchema),
  ImageController.deleteMultipleImages
);
export const ImageRoutes = router;
