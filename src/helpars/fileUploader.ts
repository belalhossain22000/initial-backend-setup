import multer from "multer";
import path from "path";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// upload single image
const uploadSingle = upload.single("carImage");

// upload multiple image
const uploadMultiple = upload.fields([
  { name: "singleImage", maxCount: 10 },
  { name: "galleryImage", maxCount: 10 },
  { name: "interiorImage", maxCount: 10 },
  { name: "exteriorImage", maxCount: 10 },
  { name: "othersImage", maxCount: 10 },
]);



export const fileUploader = {
  upload,
  uploadSingle,
  uploadMultiple,

};
