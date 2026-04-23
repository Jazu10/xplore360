import { v2 as cloudinary } from 'cloudinary'
import { SITE_SLUG } from '@/lib/site-config'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadImage(
  file: Buffer | string,
  folder: string = SITE_SLUG
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder,
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    }

    if (typeof file === 'string') {
      // base64 or URL
      cloudinary.uploader.upload(file, uploadOptions, (err, result) => {
        if (err || !result) return reject(err)
        resolve({ url: result.secure_url, publicId: result.public_id })
      })
    } else {
      // Buffer
      const stream = cloudinary.uploader.upload_stream(uploadOptions, (err, result) => {
        if (err || !result) return reject(err)
        resolve({ url: result.secure_url, publicId: result.public_id })
      })
      stream.end(file)
    }
  })
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId)
}

export const isCloudinaryConfigured = () =>
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  )
