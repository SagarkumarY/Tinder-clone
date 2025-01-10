import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();
// Configure Cloudinary with environment variables or hardcoded credentials
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,   // Cloud name from your Cloudinary account
    api_key: process.env.CLOUDINARY_API_KEY,         // API key from Cloudinary
    api_secret: process.env.CLOUDINARY_API_SECRET,   // API secret from Cloudinary
    secure: true,  // This ensures HTTPS is used for uploads and image retrieval
});

export default cloudinary;
