'use client'

import { useState, useRef } from 'react'
import axios from 'axios'
import { reportConversionEvent } from '../lib/conversions'

interface UpscaleTask {
  task_id: string
  status: string
  message: string
  upscaled_url?: string
  original_url: string
  scale_factor: number
  created_at: string
}

export default function ImageUpscaler() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)
  const [isUpscaling, setIsUpscaling] = useState(false)
  const [upscaleTask, setUpscaleTask] = useState<UpscaleTask | null>(null)
  const [error, setError] = useState<string>('')
  const [scaleMode, setScaleMode] = useState<'sync' | 'async'>('sync')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const API_BASE = process.env.NODE_ENV === 'production' ? 'https://staticapi.kraftey.com' : (process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000')

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('File size must be less than 10MB')
        return
      }
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file')
        return
      }
      setSelectedFile(file)
      setError('')
      setImageUrl('')
      setUpscaleTask(null)
    }
  }

  // Handle URL input
  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(event.target.value)
    setSelectedFile(null)
    setError('')
    setUpscaleTask(null)
  }

  // Upload file and get URL
  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      // You might need to implement a file upload endpoint
      // For now, we'll use a placeholder URL
      const response = await axios.post(`${API_BASE}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return response.data.url
    } catch (error) {
      // Fallback: create a local URL for demonstration
      return URL.createObjectURL(file)
    }
  }

  // Start upscaling process
  const handleUpscale = async () => {
    try {
      setIsUpscaling(true)
      setError('')

      let targetUrl = imageUrl

      // If file is selected, upload it first
      if (selectedFile && !imageUrl) {
        setIsUploading(true)
        targetUrl = await uploadFile(selectedFile)
        setIsUploading(false)
      }

      if (!targetUrl) {
        throw new Error('Please select an image file or enter an image URL')
      }

      const endpoint = scaleMode === 'sync' ? '/upscale/sync' : '/upscale'
      
      const response = await axios.post(`${API_BASE}${endpoint}`, {
        image_url: targetUrl,
        scale_factor: 4
      })

      const task: UpscaleTask = response.data
      setUpscaleTask(task)

      // Track conversion for successful sync processing
      if (scaleMode === 'sync' && task.status === 'completed') {
        reportConversionEvent()
      }

      // If async mode, poll for status
      if (scaleMode === 'async') {
        pollTaskStatus(task.task_id)
      }

    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to upscale image')
    } finally {
      setIsUpscaling(false)
      setIsUploading(false)
    }
  }

  // Poll task status for async mode
  const pollTaskStatus = async (taskId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await axios.get(`${API_BASE}/upscale/status/${taskId}`)
        const task: UpscaleTask = response.data
        setUpscaleTask(task)

        if (task.status === 'completed' || task.status === 'failed') {
          clearInterval(pollInterval)
          setIsUpscaling(false)
          
          // Track conversion for successful async processing
          if (task.status === 'completed') {
            reportConversionEvent()
          }
        }
      } catch (error) {
        console.error('Error polling task status:', error)
        clearInterval(pollInterval)
        setIsUpscaling(false)
      }
    }, 2000) // Poll every 2 seconds
  }

  // Download upscaled image
  const handleDownload = async () => {
    if (!upscaleTask?.upscaled_url) return

    try {
      const response = await fetch(upscaleTask.upscaled_url)
      const blob = await response.blob()
      
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `upscaled-image-${Date.now()}.webp`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      setError('Failed to download image')
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">AI Image Upscaler</h2>
          <p className="text-purple-100 mt-1">
            Enhance your images with AI-powered upscaling technology
          </p>
        </div>

        <div className="p-6">
          {/* Mode Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Processing Mode
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="sync"
                  checked={scaleMode === 'sync'}
                  onChange={(e) => setScaleMode(e.target.value as 'sync' | 'async')}
                  className="mr-2"
                />
                <span className="text-sm">Synchronous (wait for result)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="async"
                  checked={scaleMode === 'async'}
                  onChange={(e) => setScaleMode(e.target.value as 'sync' | 'async')}
                  className="mr-2"
                />
                <span className="text-sm">Asynchronous (background processing)</span>
              </label>
            </div>
          </div>

          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Image File
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Choose Image File
              </button>
              {selectedFile && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
          </div>

          {/* URL Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Or Enter Image URL
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={handleUrlChange}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Upscale Button */}
          <button
            onClick={handleUpscale}
            disabled={isUpscaling || isUploading || (!selectedFile && !imageUrl)}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isUploading ? (
              'Uploading...'
            ) : isUpscaling ? (
              scaleMode === 'sync' ? 'Upscaling... (30-60s)' : 'Processing...'
            ) : (
              '🚀 Upscale Image (4x)'
            )}
          </button>

          {/* Task Status */}
          {upscaleTask && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Upscale Status</h3>
              
              <div className="flex items-center mb-2">
                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                  upscaleTask.status === 'completed' ? 'bg-green-500' :
                  upscaleTask.status === 'failed' ? 'bg-red-500' :
                  'bg-yellow-500 animate-pulse'
                }`}></span>
                <span className="font-medium capitalize">{upscaleTask.status}</span>
              </div>

              <p className="text-sm text-gray-600 mb-3">{upscaleTask.message}</p>

              {upscaleTask.status === 'processing' && scaleMode === 'async' && (
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div className="bg-purple-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                </div>
              )}

              {/* Results */}
              {upscaleTask.status === 'completed' && upscaleTask.upscaled_url && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-3">Results</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Original Image */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Original</h5>
                      <img
                        src={upscaleTask.original_url}
                        alt="Original"
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                    </div>

                    {/* Upscaled Image */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Upscaled (4x)</h5>
                      <img
                        src={upscaleTask.upscaled_url}
                        alt="Upscaled"
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                    </div>
                  </div>

                  {/* Download Button */}
                  <div className="mt-4 flex space-x-3">
                    <button
                      onClick={handleDownload}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      📥 Download Upscaled Image
                    </button>
                    
                    <a
                      href={upscaleTask.upscaled_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      🔗 View Full Size
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">ℹ️ How it works</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Upload an image or provide a URL</li>
              <li>• AI analyzes and enhances the image quality</li>
              <li>• Get a 4x upscaled version with improved details</li>
              <li>• Supports JPEG, PNG, WebP formats</li>
              <li>• Processing takes 30-60 seconds</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
