import { v2 as cloudinary } from 'cloudinary'
import { env } from './env'

console.log('Cloudinary config check:', {
  cloudName: env.cloudinaryCloudName,
  apiKey: env.cloudinaryApiKey ? 'SET' : 'MISSING',
  apiSecret: env.cloudinaryApiSecret ? 'SET' : 'MISSING',
})

cloudinary.config({
  cloud_name: env.cloudinaryCloudName,
  api_key: env.cloudinaryApiKey,
  api_secret: env.cloudinaryApiSecret,
})

export { cloudinary }