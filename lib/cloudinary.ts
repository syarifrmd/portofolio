import { v2 as cloudinary } from 'cloudinary'

const cloudinaryEnvKeys = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
] as const

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary

export const assertCloudinaryConfigured = () => {
  const missingKeys = cloudinaryEnvKeys.filter((key) => !process.env[key])

  if (missingKeys.length > 0) {
    throw new Error(`Cloudinary is not configured. Missing: ${missingKeys.join(', ')}`)
  }
}

export const uploadToCloudinary = async (
  file: File,
  folder: string = 'portfolio'
): Promise<{ secure_url: string; public_id: string }> => {
  assertCloudinaryConfigured()

  const buffer = Buffer.from(await file.arrayBuffer())
  const base64String = buffer.toString('base64')
  const dataURI = `data:${file.type};base64,${base64String}`

  const result = await cloudinary.uploader.upload(dataURI, {
    folder,
    resource_type: 'auto',
    transformation: [
      {
        quality: 'auto',
        format: 'auto',
      },
    ],
  })

  return {
    secure_url: result.secure_url,
    public_id: result.public_id,
  }
}

export const deleteFromCloudinary = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error)
    throw new Error('Failed to delete file')
  }
}
