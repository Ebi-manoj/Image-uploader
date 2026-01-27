import { v2 as cloudinary } from 'cloudinary';
import { Env } from '../utils/Env.js';

cloudinary.config({
  cloud_name: Env.CLOUDINARY_NAME,
  api_key: Env.CLOUDINARY_KEY,
  api_secret: Env.CLOUDINARY_SECRET,
});

export { cloudinary };
