// Image.controller: Module file for the Image.controller functionality.
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { ImageService } from "./Image.service";

// Controller for creating an image
const createImage = catchAsync(async (req: Request, res: Response) => {
  const result = await ImageService.createImage(req);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Image Created successfully!",
    data: result,
  });
});

// Controller for creating images
const createImages = catchAsync(async (req: Request, res: Response) => {
  const result = await ImageService.createImages(req);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Images Created successfully!",
    data: result,
  });
});




// Controller for deleting an image
const deleteImage = catchAsync(async (req: Request, res: Response) => {
  const result = await ImageService.deleteImage(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Image deleted successfully!",
    data: result,
  });
});



//
const deleteMultipleImages = catchAsync(async (req: Request, res: Response) => {
  const { urls } = req.body;
  const result = await ImageService.deleteMultipleImages(urls);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Images Deleted successfully",
    data: result
  });
});


export const ImageController = {
  createImage,

  deleteImage,
  createImages,
  deleteMultipleImages
};
