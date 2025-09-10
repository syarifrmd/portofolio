import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary

export const uploadToCloudinary = async (
  file: File,
  folder: string = 'portfolio'
): Promise<{ secure_url: string; public_id: string }> => {
  try {
    // Convert file to base64
    const buffer = Buffer.from(await file.arrayBuffer())
    const base64String = buffer.toString('base64')
    const dataURI = `data:${file.type};base64,${base64String}`

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: folder,
      resource_type: 'auto', // Automatically detect file type (image, video, etc.)
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
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    throw new Error('Failed to upload file')
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
