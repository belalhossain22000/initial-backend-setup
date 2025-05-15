/* eslint-disable no-console */
import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import ApiError from '../errors/ApiErrors';
import httpStatus from 'http-status';

dotenv.config({ path: path.join(process.cwd(), '.env') });

interface UploadResponse {
  Location: string;
}

// Define the expected file object structure
interface FileObject {
  originalname: string;
  path?: string;          // Making path optional since it might not exist
  buffer?: Buffer;        // Adding buffer for when path isn't available
  mimetype: string;
}


const s3Client = new S3Client({
  region: 'us-east-1', // Set any valid region
  endpoint: `${process.env.DO_SPACE_ENDPOINT}`,
  credentials: {
    accessKeyId: `${process.env.DO_SPACE_ACCESS_KEY}`,
    secretAccessKey: `${process.env.DO_SPACE_SECRET_KEY}`,
  },
});

export const uploadToDigitalOceanAWS = async (
  file: FileObject,
): Promise<UploadResponse> => {
  try {

    let fileBody: Buffer | Readable;

    // Handle both file paths and buffers
    if (file.path) {
      // Check if file path exists before reading
      try {
        await fs.promises.access(file.path, fs.constants.F_OK);
        fileBody = fs.createReadStream(file.path);
      } catch (err) {
        console.error(`File path doesn't exist: ${file.path}`);
        throw new Error(`File not found at path: ${file.path}`);
      }
    } else if (file.buffer) {
      // Use the buffer directly if path is not available
      fileBody = file.buffer;
    } else {
      throw new Error('Neither file path nor buffer is available');
    }

    // Prepare the upload command
    const command = new PutObjectCommand({
      Bucket: `${process.env.DO_SPACE_BUCKET}`,
      Key: `${file.originalname}`,
      Body: fileBody,
      ACL: 'public-read',
      ContentType: file.mimetype,
    });

    // Execute the upload
    await s3Client.send(command);
    
    // Construct the direct URL to the uploaded file
    const Location = `${process.env.DO_SPACE_ENDPOINT}/${process.env.DO_SPACE_BUCKET}/${file.originalname}`;

    return { Location };
  } catch (error) {
    console.error(`Error uploading file: ${file.originalname}`, error);
    throw error;
  }
};

export const deleteFromDigitalOceanAWS = async (
  fileUrl: string,
): Promise<void> => {
  try {
    // Extract the file key from the URL
    const key = fileUrl.replace(
      `${process.env.DO_SPACE_ENDPOINT}/${process.env.DO_SPACE_BUCKET}/`,
      '',
    );

    // Prepare the delete command
    const command = new DeleteObjectCommand({
      Bucket: `${process.env.DO_SPACE_BUCKET}`,
      Key: key,
    });

    // Execute the delete command
    await s3Client.send(command);

    console.log(`Successfully deleted file: ${fileUrl}`);
  } catch (error: any) {
    console.error(`Error deleting file: ${fileUrl}`, error);
    throw new Error(`Failed to delete file: ${error?.message}`);
  }
};


//delete multiple image url
export const deleteMultipleFromDigitalOceanAWS = async (
  fileUrls: string[]
): Promise<void> => {
  try {
    if (!Array.isArray(fileUrls) || fileUrls.length === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, "No file URLs provided");
    }

    // Extract file keys from URLs
    const objectKeys = fileUrls.map((fileUrl) =>
      fileUrl.replace(
        `${process.env.DO_SPACE_ENDPOINT}/${process.env.DO_SPACE_BUCKET}/`,
        ""
      )
    );

    // Prepare the delete command for multiple objects
    const command = new DeleteObjectsCommand({
      Bucket: process.env.DO_SPACE_BUCKET!,
      Delete: {
        Objects: objectKeys.map((Key) => ({ Key })),
      },
    });

    await s3Client.send(command);

    // console.log(`Successfully deleted files:`, fileUrls);
  } catch (error: any) {
    console.error(`Error deleting files:`, error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Failed to delete files: ${error?.message}`
    );
  }
};
