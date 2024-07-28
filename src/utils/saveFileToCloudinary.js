import cloudinary from 'cloudinary';

// import { CLOUDINARY } from '../constants/index.js';
// import { env } from '../utils/env.js';

// cloudinary.v2.config({
//   secure: true,
//   cloud_name: env(CLOUDINARY.CLOUD_NAME),
//   api_key: env(CLOUDINARY.API_KEY),
//   api_secret: env(CLOUDINARY.API_SECRET),
// });

// export const saveFileToCloudinary = async (file) => {
//   const response = await cloudinary.v2.uploader.upload(file.path);
//   //   await fs.unlink(file.path);
//   return response.secure_url;
// };

// const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const saveFileToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      upload_preset: 'ml_default', // Замість 'your_upload_preset' використовуйте ім'я вашого пресета
    });
    return result.secure_url; // Повертає URL зображення
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw new Error('Error uploading to Cloudinary');
  }
};

export default saveFileToCloudinary;
