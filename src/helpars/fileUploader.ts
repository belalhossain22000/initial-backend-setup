import multer from "multer";

// Memory storage configuration
const storage = multer.memoryStorage(); 



const upload = multer({ storage: storage });



export const fileUploader = {
  upload,
};
