'use client'

import { useState, useRef, DragEvent } from 'react'
import Image from 'next/image'
import { Upload, X, FileImage, FileVideo, Loader2 } from 'lucide-react'

interface FileUploadProps {
  onFileUploaded: (fileData: {
    url: string
    publicId: string
    originalName: string
    size: number
    type: string
  }) => void
  accept?: string
  multiple?: boolean
  maxSize?: number // in MB
  folder?: string
  className?: string
}

interface UploadedFile {
  url: string
  publicId: string
  originalName: string
  size: number
  type: string
}

export default function FileUpload({
  onFileUploaded,
  accept = 'image/*,video/*',
  multiple = false,
  maxSize = 10,
  folder = 'portfolio',
  className = ''
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0] // Take first file if multiple not allowed
    uploadFile(file)
  }

  const uploadFile = async (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size should not exceed ${maxSize}MB`)
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = () => setPreview(reader.result as string)
        reader.readAsDataURL(file)
      }

      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 100)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      const result = await response.json()

      if (result.success) {
        onFileUploaded(result.data)
        setTimeout(() => {
          setPreview(null)
          setUploadProgress(0)
        }, 1000)
      } else {
        alert(result.message || 'Upload failed')
        setPreview(null)
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload file')
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  const handleDrag = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files)
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`relative ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* Upload area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={!uploading ? openFileDialog : undefined}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-colors duration-200
          ${dragActive || uploading
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
          }
          ${uploading ? 'cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        {uploading ? (
          <div className="space-y-4">
            {preview && (
              <div className="relative w-20 h-20 mx-auto rounded-lg overflow-hidden">
                <Image
                  src={preview}
                  alt="Upload preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-blue-500" />
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Uploading... {uploadProgress}%
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center space-x-2">
              <FileImage className="w-8 h-8 text-gray-400" />
              <FileVideo className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                Drop files here or click to upload
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Supports images and videos (max {maxSize}MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* File type info */}
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        <p>Supported formats:</p>
        <p>Images: JPEG, PNG, GIF, WebP</p>
        <p>Videos: MP4, MOV, AVI, WMV</p>
      </div>
    </div>
  )
}
