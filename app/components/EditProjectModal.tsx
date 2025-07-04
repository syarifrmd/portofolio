'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Project {
  _id: string
  title: string
  category: string
  description: string
  techStack: string[]
  status: 'Completed' | 'In Progress' | 'Planned'
  githubUrls?: string[]
  liveUrls?: string[]
  images?: string[]
  videos?: string[]
  startDate?: string
  createdAt: string
  updatedAt: string
}

interface EditProjectModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (updatedProject: Project) => void
}

export default function EditProjectModal({ project, isOpen, onClose, onUpdate }: EditProjectModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    techStack: '',
    status: 'Completed' as 'Completed' | 'In Progress' | 'Planned',
    githubUrls: [''],
    liveUrls: [''],
    images: [''],
    videos: [''],
    startDate: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Populate form when project changes
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        category: project.category,
        description: project.description,
        techStack: project.techStack.join(', '),
        status: project.status,
        githubUrls: project.githubUrls && project.githubUrls.length > 0 ? project.githubUrls : [''],
        liveUrls: project.liveUrls && project.liveUrls.length > 0 ? project.liveUrls : [''],
        images: project.images && project.images.length > 0 ? project.images : [''],
        videos: project.videos && project.videos.length > 0 ? project.videos : [''],
        startDate: project.startDate || ''
      })
      setMessage(null)
    }
  }, [project])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!project) return

    setLoading(true)
    setMessage(null)

    try {
      const projectData = {
        id: project._id,
        ...formData,
        techStack: formData.techStack.split(',').map(tech => tech.trim()).filter(tech => tech)
      }

      const response = await fetch('/api/projects', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: 'success', text: 'Project updated successfully!' })
        
        // Update the project in the parent component
        const updatedProject: Project = {
          ...project,
          ...formData,
          techStack: formData.techStack.split(',').map(tech => tech.trim()).filter(tech => tech),
          updatedAt: new Date().toISOString()
        }
        onUpdate(updatedProject)
        
        // Close modal after a short delay
        setTimeout(() => {
          onClose()
        }, 1500)
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update project' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while updating the project' })
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

  const handleImagesChange = (idx: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((url, i) => i === idx ? value : url)
    }))
  }

  const handleVideosChange = (idx: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      videos: prev.videos.map((url, i) => i === idx ? value : url)
    }))
  }

  const handleGithubUrlsChange = (idx: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      githubUrls: prev.githubUrls.map((url, i) => i === idx ? value : url)
    }))
  }

  const handleLiveUrlsChange = (idx: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      liveUrls: prev.liveUrls.map((url, i) => i === idx ? value : url)
    }))
  }

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }))
  }

  const addVideoField = () => {
    setFormData(prev => ({
      ...prev,
      videos: [...prev.videos, '']
    }))
  }

  const addGithubUrlField = () => {
    setFormData(prev => ({
      ...prev,
      githubUrls: [...prev.githubUrls, '']
    }))
  }

  const addLiveUrlField = () => {
    setFormData(prev => ({
      ...prev,
      liveUrls: [...prev.liveUrls, '']
    }))
  }

  const removeImageField = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx)
    }))
  }

  const removeVideoField = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== idx)
    }))
  }

  const removeGithubUrlField = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      githubUrls: prev.githubUrls.filter((_, i) => i !== idx)
    }))
  }

  const removeLiveUrlField = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      liveUrls: prev.liveUrls.filter((_, i) => i !== idx)
    }))
  }

  if (!isOpen || !project) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Project
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Update the project details below
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                GitHub Repository URLs
              </label>
              {formData.githubUrls.map((url, idx) => (
                <div key={idx} className="flex items-center space-x-2 mb-2">
                  <input
                    type="url"
                    value={url}
                    onChange={e => handleGithubUrlsChange(idx, e.target.value)}
                    placeholder="https://github.com/username/repository"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => removeGithubUrlField(idx)}
                    className="text-red-500 hover:text-red-700"
                  >Remove</button>
                </div>
              ))}
              <button
                type="button"
                onClick={addGithubUrlField}
                className="text-blue-500 hover:text-blue-700"
              >Add GitHub URL</button>
            </div>

            {/* Live Demo URLs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Live Demo URLs
              </label>
              {formData.liveUrls.map((url, idx) => (
                <div key={idx} className="flex items-center space-x-2 mb-2">
                  <input
                    type="url"
                    value={url}
                    onChange={e => handleLiveUrlsChange(idx, e.target.value)}
                    placeholder="https://your-demo-site.com"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => removeLiveUrlField(idx)}
                    className="text-red-500 hover:text-red-700"
                  >Remove</button>
                </div>
              ))}
              <button
                type="button"
                onClick={addLiveUrlField}
                className="text-blue-500 hover:text-blue-700"
              >Add Live Demo URL</button>
            </div>

            {/* Images URLs */}
            <div>
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
              >Add Image</button>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Gunakan URL gambar dari Unsplash, Imgur, atau hosting gambar lainnya
              </p>
              {/* Image Previews */}
              {formData.images.filter(url => url.trim() !== '').length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {formData.images.filter(url => url.trim() !== '').map((url, idx) => (
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
                    onChange={e => handleVideosChange(idx, e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... atau https://vimeo.com/..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => removeVideoField(idx)}
                    className="text-red-500 hover:text-red-700"
                  >Remove</button>
                </div>
              ))}
              <button
                type="button"
                onClick={addVideoField}
                className="text-blue-500 hover:text-blue-700"
              >Add Video</button>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Gunakan URL video dari YouTube, Vimeo, atau platform video lainnya
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Updating...' : 'Update Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 