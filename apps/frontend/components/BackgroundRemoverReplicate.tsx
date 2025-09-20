'use client'

import { useState, useRef } from 'react'
import { api, ReplicateBgRemovalResponse } from '../lib/api'

interface BgRemovalTask {
  task_id: string
  status: string
  message: string
  processed_url?: string
  original_url: string
  created_at: string
}

export default function BackgroundRemoverReplicate() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [bgTask, setBgTask] = useState<BgRemovalTask | null>(null)
  const [error, setError] = useState<string>('')
  const [processingMode, setProcessingMode] = useState<'sync' | 'async'>('sync')
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
      setBgTask(null)
    }
  }

  // Handle URL input
  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(event.target.value)
    setSelectedFile(null)
    setError('')
    setBgTask(null)
  }

  // Upload file and get URL
  const uploadFile = async (file: File): Promise<string> => {
    try {
      const uploadResponse = await api.uploadFile(file)
      return uploadResponse.url
    } catch (error) {
      throw new Error(`Upload failed: ${error}`)
    }
  }

  // Start background removal process
  const handleRemoveBackground = async () => {
    try {
      setIsProcessing(true)
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

      let response: ReplicateBgRemovalResponse

      if (processingMode === 'sync') {
        response = await api.removeBgReplicate(targetUrl)
      } else {
        response = await api.removeBgReplicateAsync(targetUrl)
      }

      const task: BgRemovalTask = {
        task_id: response.task_id,
        status: response.status,
        message: response.message,
        processed_url: response.processed_url,
        original_url: response.original_url,
        created_at: response.created_at
      }

      setBgTask(task)

      // If async mode, poll for status
      if (processingMode === 'async') {
        pollTaskStatus(task.task_id)
      }

    } catch (err: any) {
      setError(err.message || 'Failed to remove background')
    } finally {
      setIsProcessing(false)
      setIsUploading(false)
    }
  }

  // Poll task status for async mode
  const pollTaskStatus = async (taskId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await api.getBgRemovalStatus(taskId)
        const task: BgRemovalTask = {
          task_id: response.task_id,
          status: response.status,
          message: response.message,
          processed_url: response.processed_url,
          original_url: response.original_url,
          created_at: response.created_at
        }
        setBgTask(task)

        if (task.status === 'completed' || task.status === 'failed') {
          clearInterval(pollInterval)
          setIsProcessing(false)
        }
      } catch (error) {
        console.error('Error polling task status:', error)
        clearInterval(pollInterval)
        setIsProcessing(false)
      }
    }, 2000) // Poll every 2 seconds
  }

  // Download processed image
  const handleDownload = async () => {
    if (!bgTask?.processed_url) return

    try {
      const response = await fetch(bgTask.processed_url)
      const blob = await response.blob()
      
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `bg-removed-${Date.now()}.png`
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
        <div className="bg-gradient-to-r from-green-600 to-blue-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">AI Background Remover</h2>
          <p className="text-green-100 mt-1">
            Remove backgrounds instantly with advanced AI technology
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
                  checked={processingMode === 'sync'}
                  onChange={(e) => setProcessingMode(e.target.value as 'sync' | 'async')}
                  className="mr-2"
                />
                <span className="text-sm">Synchronous (wait for result)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="async"
                  checked={processingMode === 'async'}
                  onChange={(e) => setProcessingMode(e.target.value as 'sync' | 'async')}
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
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Remove Background Button */}
          <button
            onClick={handleRemoveBackground}
            disabled={isProcessing || isUploading || (!selectedFile && !imageUrl)}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isUploading ? (
              'Uploading...'
            ) : isProcessing ? (
              processingMode === 'sync' ? 'Removing Background... (30-60s)' : 'Processing...'
            ) : (
              '✨ Remove Background'
            )}
          </button>

          {/* Task Status */}
          {bgTask && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Processing Status</h3>
              
              <div className="flex items-center mb-2">
                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                  bgTask.status === 'completed' ? 'bg-green-500' :
                  bgTask.status === 'failed' ? 'bg-red-500' :
                  'bg-yellow-500 animate-pulse'
                }`}></span>
                <span className="font-medium capitalize">{bgTask.status}</span>
              </div>

              <p className="text-sm text-gray-600 mb-3">{bgTask.message}</p>

              {bgTask.status === 'processing' && processingMode === 'async' && (
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                </div>
              )}

              {/* Results */}
              {bgTask.status === 'completed' && bgTask.processed_url && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-3">Results</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Original Image */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Original</h5>
                      <img
                        src={bgTask.original_url}
                        alt="Original"
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                    </div>

                    {/* Processed Image */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Background Removed</h5>
                      <div 
                        className="w-full h-48 rounded-lg border relative"
                        style={{ 
                          backgroundImage: 'repeating-conic-gradient(#f0f0f0 0% 25%, #e0e0e0 0% 50%) 50% / 20px 20px'
                        }}
                      >
                        <img
                          src={bgTask.processed_url}
                          alt="Background Removed"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Download Button */}
                  <div className="mt-4 flex space-x-3">
                    <button
                      onClick={handleDownload}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      📥 Download PNG
                    </button>
                    
                    <a
                      href={bgTask.processed_url}
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
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2">ℹ️ How it works</h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Upload an image or provide a URL</li>
              <li>• Advanced AI analyzes and removes the background</li>
              <li>• Get a high-quality PNG with transparent background</li>
              <li>• Supports JPEG, PNG, WebP formats</li>
              <li>• Processing takes 30-60 seconds</li>
              <li>• Perfect for product photos, portraits, and social media</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
