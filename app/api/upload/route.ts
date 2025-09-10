import { NextRequest, NextResponse } from 'next/server'
import { uploadToCloudinary } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    console.log('📤 File upload API called')
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'portfolio'
    
    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/png', 
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/mov',
      'video/avi',
      'video/wmv'
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'File type not supported. Please upload images (JPEG, PNG, GIF, WebP) or videos (MP4, MOV, AVI, WMV)' 
        },
        { status: 400 }
      )
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'File size too large. Please upload files smaller than 10MB' 
        },
        { status: 400 }
      )
    }

    console.log('📁 Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type)
    
    // Upload to Cloudinary
    const result = await uploadToCloudinary(file, folder)
    
    console.log('✅ File uploaded successfully:', result.secure_url)
    
    return NextResponse.json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        originalName: file.name,
        size: file.size,
        type: file.type
      }
    })

  } catch (error) {
    console.error('❌ File upload error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to upload file' 
      },
      { status: 500 }
    )
  }
}
