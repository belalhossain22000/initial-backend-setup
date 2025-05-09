// Image.service: Module file for the Image.service functionality.
import { PrismaClient } from "@prisma/client";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";

import { Request } from "express";


import { uploadFile } from "../../../helpars/uploadFile";
import { deleteFromDigitalOceanAWS, deleteMultipleFromDigitalOceanAWS } from "../../../helpars/uploadToDigitalOceanAWS";


//create image
const createImage = async (req: Request) => {

  if (!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No image provided");
  }

  const file = req.file;

  let imageUrl = (await uploadFile(file!, "file")).Location;



  return { imageUrl };
};

// Service for creating images//multiple images creation
const createImages = async (req: Request) => {
  const files = req.files as any[];
  if (!files || files.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No images provided");
  }

  const imageUrls = [];

  for (let file of files) {
    let url = (await uploadFile(file, "files")).Location;

    imageUrls.push(url);
  }

  return { imageUrls };
};


//delete single image
const deleteImage = async (payload: { url: string }) => {
  if (!payload.url) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No image provided");
  }
  const result = deleteFromDigitalOceanAWS(payload.url);
  return result;
};


//delete multiple images
const deleteMultipleImages = async (urls: string[]) => {
  if (!urls || urls.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No images provided for deletion");
  }

  const result = deleteMultipleFromDigitalOceanAWS(urls)
    
 return result
};

export const ImageService = {
  createImage,
  createImages,
  deleteImage,
  deleteMultipleImages
};
