import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import { Request } from "express";
import dotenv from "dotenv";

process.env.DOTENV_KEY = "";
dotenv.config();

// Configure Cloudinary
console.log("Configuring Cloudinary with Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        timeout: 10000,
    });
} else {
    console.warn("Cloudinary not configured properly. Missing CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, or CLOUDINARY_API_SECRET. Falling back to local disk storage.");
}

// Configure Storage Fallback
let storage;
if (isCloudinaryConfigured) {
    storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: async (req: Request, file: Express.Multer.File) => ({
            folder: "green_africa_farm_products",
            allowed_formats: ["jpg", "jpeg", "png", "webp"],
            transformation: [{ width: 800, height: 800, crop: "limit" }, { quality: "auto" }],
        }),
    });
} else {
    // Disk storage for local development
    storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "public/uploads/");
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            cb(null, uniqueSuffix + "-" + file.originalname);
        }
    });
}

export const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});
export { cloudinary };