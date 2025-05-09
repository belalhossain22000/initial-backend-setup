import ApiError from "../errors/ApiErrors";
import { uploadToDigitalOceanAWS } from "./uploadToDigitalOceanAWS";

export const uploadFile = async (file: Express.Multer.File, fileName: string) => {
    if (!file) {
      throw new ApiError(400, `${fileName} image is required`);
    }
    return await uploadToDigitalOceanAWS(file);
  };