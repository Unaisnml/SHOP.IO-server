import path from "path";
import fs from 'fs';
import os from 'os';
import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
//   secure: true,
});

const storage = multer.memoryStorage();
function checkFileType(file, cb) {
  const fileTypes = /jpg|jpeg|png/;
  const extname = fileTypes.test(
    path.extname(file.originalname.toString()).toLowerCase()
  );
  const mimetype = fileTypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Images only");
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

function generateUniqueFileName() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }


  router.post("/", upload.array("images", 3), async (req, res) => {
    try {
      const uploadedImages = [];
  
      for (const file of req.files) {
        const tempFilePath = path.join(os.tmpdir(), generateUniqueFileName() + path.extname(file.originalname));
        
        // Write the file buffer to a temporary file
        fs.writeFileSync(tempFilePath, file.buffer);
  
        // Upload the temporary file to Cloudinary
        const result = await cloudinary.uploader.upload(tempFilePath, {
          folder: "SHOP.IO",
        });
  
        // Push the secure URL of the uploaded image to the array
        uploadedImages.push(result.secure_url);
  
        // Delete the temporary file
        fs.unlinkSync(tempFilePath);
      }
  // console.log("Uploaded images: ",uploadedImages);
      res.send({
        message: "Images uploaded",
        images: uploadedImages,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error uploading images");
    }
  });


export default router;
