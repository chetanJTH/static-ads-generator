'use client'

import { useState } from 'react'
import { reportConversionEvent } from '../../lib/conversions'

export default function WatermarkRemoverClient() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setProcessedImage(null)
      setOriginalImage(null)
      setError(null)
      
      // Show preview of original image
      const reader = new FileReader()
      reader.onload = (e) => {
        setOriginalImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveWatermark = async () => {
    if (!selectedFile) return

    setIsProcessing(true)
    setError(null)

    try {
      console.log('Starting watermark removal for file:', selectedFile.name)
      
      const formData = new FormData()
      formData.append('file', selectedFile)

      console.log('Sending request to:', `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'}/api/watermark-remover`)
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'}/api/watermark-remover`, {
        method: 'POST',
        body: formData,
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response:', errorText)
        
        try {
          const errorData = JSON.parse(errorText)
          throw new Error(errorData.detail || 'Failed to remove watermark')
        } catch {
          throw new Error(`Server error (${response.status}): ${errorText}`)
        }
      }

      const result = await response.json()
      console.log('Success result:', result)
      setProcessedImage(result.processed_image)
      
      // Track conversion for successful watermark removal
      reportConversionEvent()
    } catch (error: any) {
      console.error('Watermark removal error:', error)
      setError(error.message || 'An error occurred while processing the image')
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadImage = () => {
    if (processedImage) {
      const link = document.createElement('a')
      link.href = processedImage
      link.download = 'watermark-removed.jpg'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">AI Watermark Remover</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Area */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Image</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-red-400 transition-colors">
            {originalImage ? (
              <div className="space-y-4">
                <img
                  src={originalImage}
                  alt="Original"
                  className="max-h-64 mx-auto rounded-lg"
                />
                <p className="text-sm text-gray-600">
                  {selectedFile?.name}
                </p>
                <button
                  onClick={() => document.getElementById('file-input')?.click()}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Choose different image
                </button>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Upload Image with Watermark
                </h3>
                <p className="text-gray-600 mb-4">
                  Drag and drop your image here or click to browse
                </p>
                <button
                  onClick={() => document.getElementById('file-input')?.click()}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Choose Image
                </button>
                <p className="text-sm text-gray-500 mt-2">
                  Supports JPEG, PNG, WebP (max 10MB)
                </p>
              </>
            )}
            
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
          
          {selectedFile && !isProcessing && (
            <button
              onClick={handleRemoveWatermark}
              className="w-full mt-4 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Remove Watermark with AI
            </button>
          )}
          
          {isProcessing && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing with AI...
              </div>
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Preview Area */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Result Preview</h2>
          <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
            {processedImage ? (
              <img
                src={processedImage}
                alt="Watermark Removed"
                className="max-h-full max-w-full rounded-lg"
              />
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-500">Processed image will appear here</p>
              </div>
            )}
          </div>
          
          <div className="mt-4 space-y-2">
            <button 
              onClick={downloadImage}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
              disabled={!processedImage}
            >
              Download Result
            </button>
            <p className="text-xs text-gray-500 text-center">
              {processedImage ? 'Click to download the processed image' : 'Process an image to download the result'}
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">1. Upload</h3>
            <p className="text-sm text-gray-600">Upload your image with watermarks</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">2. AI Process</h3>
            <p className="text-sm text-gray-600">Our AI automatically removes watermarks</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">3. Download</h3>
            <p className="text-sm text-gray-600">Download your clean, watermark-free image</p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-medium text-yellow-800 mb-2">Important Notice</h3>
        <p className="text-sm text-yellow-700">
          Only use this tool on images you own or have permission to modify. 
          Removing watermarks from copyrighted images without permission may violate copyright laws.
        </p>
      </div>
    </div>
  )
}




