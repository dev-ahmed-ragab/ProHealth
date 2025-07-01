import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dn7s97ydy',
  api_key: process.env.CLOUDINARY_API_KEY || '661839662643331',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'GydXCIzBQBFptgSEfjvWrODNUnQ',
});

console.log('Cloudinary Config:', cloudinary.config());

export default cloudinary;