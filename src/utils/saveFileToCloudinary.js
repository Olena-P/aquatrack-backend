import cloudinary from 'cloudinary';

import { CLOUDINARY } from '../constants/index.js';
import { env } from '../utils/env.js';

cloudinary.v2.config({
  secure: true,
  cloud_name: env(CLOUDINARY.CLOUD_NAME),
  api_key: env(CLOUDINARY.API_KEY),
  api_secret: env(CLOUDINARY.API_SECRET),
});

const saveFileToCloudinary = async (file) => {
  const result = await cloudinary.v2.uploader.upload(file.path, {
    upload_preset: 'ml_default', // Замість 'your_upload_preset' використовуйте ім'я вашого пресета
  });
  return result.secure_url; // Повертає URL зображення
};

export default saveFileToCloudinary;
