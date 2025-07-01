import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: 'dn7s97ydy',
  api_key: '661839662643331',
  api_secret: 'GydXCIzBQBFptgSEfjvWrODNUnQ',
});
console.log('Cloudinary Config:', cloudinary.config());

export default cloudinary;