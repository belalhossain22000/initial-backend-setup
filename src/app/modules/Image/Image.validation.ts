// Image.validation: Module file for the Image.validation functionality.
import * as z from "zod";

export const createImageSchema = z.object({
    body: z.object({
      file: z.string({
        required_error: "Image file is required"
      }).url("Invalid image URL")
    })
  });


const deleteMultipleImagesSchema = z.object({
      urls: z.array(
        z.string({
          required_error: "Image URL is required"
        }).url("Invalid image URL")
      ).min(1, "At least one image URL is required")

  });

  export const ImageValidation = {
    createImageSchema,
    deleteMultipleImagesSchema
  };