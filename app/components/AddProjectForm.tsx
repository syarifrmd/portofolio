'use client'

import { useState } from 'react'
import Image from 'next/image'
import FileUpload from './FileUpload'
import { X, ExternalLink } from 'lucide-react'

interface ProjectForm {
  title: string;
  category: string;
  description: string;
  techStack: string; // Will be comma-separated string
  status: 'Completed' | 'In Progress' | 'Planned';
  startDate: string;
  githubUrls: string[];
  liveUrls: string[];
  images: string[];
  videos: string[];
}

interface UploadedFile {
  url: string;
  publicId: string;
  originalName: string;
  size: number;
  type: string;
}

export default function AddProjectForm() {
  const [formData, setFormData] = useState<ProjectForm>({
    title: '',
    category: '',
    description: '',
    techStack: '',
    status: 'Completed',
    startDate: '',
    githubUrls: [''],
    liveUrls: [''],
    images: [''],
    videos: ['']
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const projectData = {
        ...formData,
        techStack: formData.techStack.split(',').map(tech => tech.trim()).filter(tech => tech),
        githubUrls: formData.githubUrls.filter(url => url.trim() !== ''),
        liveUrls: formData.liveUrls.filter(url => url.trim() !== ''),
        images: formData.images.filter(url => url.trim() !== ''),
        videos: formData.videos.filter(url => url.trim() !== '')
      }

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: 'success', text: 'Project added successfully!' })
        // Reset form
        setFormData({
          title: '',
          category: '',
          description: '',
          techStack: '',
          status: 'Completed',
          startDate: '',
          githubUrls: [''],
          liveUrls: [''],
          images: [''],
          videos: ['']
        })
        setUploadedFiles([])
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to add project' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while adding the project' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleUrlChange = (type: 'githubUrls' | 'liveUrls' | 'videos', idx: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].map((url, i) => i === idx ? value : url)
    }))
  }

  const addUrlField = (type: 'githubUrls' | 'liveUrls' | 'videos') => {
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], '']
    }))
  }

  const removeUrlField = (type: 'githubUrls' | 'liveUrls' | 'videos', idx: number) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== idx)
    }))
  }

  const handleImagesChange = (idx: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((url, i) => i === idx ? value : url)
    }))
  }

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }))
  }

  const removeImageField = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx)
    }))
  }

  const handleFileUploaded = (fileData: UploadedFile) => {
    setUploadedFiles(prev => [...prev, fileData])
    
    // Add to appropriate array based on file type
    if (fileData.type.startsWith('image/')) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, fileData.url]
      }))
    } else if (fileData.type.startsWith('video/')) {
      setFormData(prev => ({
        ...prev,
        videos: [...prev.videos, fileData.url]
      }))
    }
  }

  const removeUploadedFile = (fileUrl: string, fileType: string) => {
    setUploadedFiles(prev => prev.filter(file => file.url !== fileUrl))
    
    if (fileType.startsWith('image/')) {
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter(url => url !== fileUrl)
      }))
    } else if (fileType.startsWith('video/')) {
      setFormData(prev => ({
        ...prev,
        videos: prev.videos.filter(url => url !== fileUrl)
      }))
    }
  }

  return (
    <div>
      {message && (
        <div className={`p-4 mb-6 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 border border-green-200 dark:border-green-800' 
            : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 border border-red-200 dark:border-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Project Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category *
          </label>
          <input
            type="text"
            id="category"
            name="category"
            placeholder="Web Development"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Tech Stack */}
        <div>
          <label htmlFor="techStack" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tech Stack (comma-separated) *
          </label>
          <input
            type="text"
            id="techStack"
            name="techStack"
            value={formData.techStack}
            onChange={handleChange}
            required
            placeholder="React, TypeScript, Tailwind CSS"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status *
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option>Completed</option>
            <option>In Progress</option>
            <option>Planned</option>
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* GitHub URLs */}
        <div>
          <label htmlFor="githubUrls" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            GitHub URLs
          </label>
          {formData.githubUrls.map((url, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <input
                type="url"
                id={`githubUrls-${idx}`}
                name={`githubUrls-${idx}`}
                value={url}
                onChange={(e) => handleUrlChange('githubUrls', idx, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="button"
                onClick={() => removeUrlField('githubUrls', idx)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addUrlField('githubUrls')}
            className="text-blue-500 hover:text-blue-700"
          >
            Add URL
          </button>
        </div>

        {/* Live URLs */}
        <div>
          <label htmlFor="liveUrls" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Live Demo URLs
          </label>
          {formData.liveUrls.map((url, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <input
                type="url"
                id={`liveUrls-${idx}`}
                name={`liveUrls-${idx}`}
                value={url}
                onChange={(e) => handleUrlChange('liveUrls', idx, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="button"
                onClick={() => removeUrlField('liveUrls', idx)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addUrlField('liveUrls')}
            className="text-blue-500 hover:text-blue-700"
          >
            Add URL
          </button>
        </div>

        {/* File Upload Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Upload Images & Videos
          </h3>
          
          {/* File Upload Component */}
          <FileUpload
            onFileUploaded={handleFileUploaded}
            accept="image/*,video/*"
            multiple={false}
            maxSize={10}
            folder="portfolio/projects"
            className="mb-4"
          />

          {/* Uploaded Files Preview */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700 dark:text-gray-300">Uploaded Files:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {uploadedFiles.map((file, idx) => (
                  <div key={idx} className="relative group border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                    {file.type.startsWith('image/') ? (
                      <div className="relative w-full h-32 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
                        <Image
                          src={file.url}
                          alt={file.originalName}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="w-full h-32 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-12 h-12 mx-auto mb-2 bg-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">🎬</span>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Video File</p>
                        </div>
                      </div>
                    )}
                    
                    {/* File Info */}
                    <div className="mt-2">
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                        {file.originalName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => removeUploadedFile(file.url, file.type)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    {/* View Link */}
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-2 right-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Manual URL Input (Alternative Method) */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Or Add URLs Manually
          </h3>
          
          {/* Images URLs */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Image URLs
            </label>
            {formData.images.map((url, idx) => (
              <div key={idx} className="flex items-center space-x-2 mb-2">
                <input
                  type="url"
                  value={url}
                  onChange={e => handleImagesChange(idx, e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => removeImageField(idx)}
                  className="text-red-500 hover:text-red-700"
                >Remove</button>
              </div>
            ))}
            <button
              type="button"
              onClick={addImageField}
              className="text-blue-500 hover:text-blue-700"
            >Add Image URL</button>
            
            {/* Image Previews for Manual URLs */}
            {formData.images.filter(url => url.trim() !== '' && !uploadedFiles.some(file => file.url === url)).length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-3">
                {formData.images.filter(url => url.trim() !== '' && !uploadedFiles.some(file => file.url === url)).map((url, idx) => (
                  <div key={idx} className="relative w-full h-24 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <Image
                      src={url}
                      alt={`Preview ${idx+1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

          {/* Video URLs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Video URLs
            </label>
            {formData.videos.map((url, idx) => (
              <div key={idx} className="flex items-center space-x-2 mb-2">
                <input
                  type="url"
                  value={url}
                  onChange={e => handleUrlChange('videos', idx, e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... atau https://vimeo.com/..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => removeUrlField('videos', idx)}
                  className="text-red-500 hover:text-red-700"
                >Remove</button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addUrlField('videos')}
              className="text-blue-500 hover:text-blue-700"
            >Add Video URL</button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Upload video files directly or use URLs from YouTube, Vimeo, etc.
            </p>
          </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Adding Project...' : 'Add Project'}
        </button>
      </form>
    </div>
  )
} 