const dotenv=require("dotenv");
const cloudinary=require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer=require("multer");
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "store_logos",
    format: async (req, file) => "webp", 
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  },
});  // Debug log
const upload = multer({ storage});
module.exports = { upload, cloudinary };
