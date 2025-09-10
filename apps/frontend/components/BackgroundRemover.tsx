'use client'

import { useState, useRef, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { api } from '../lib/api'

type State = 'idle' | 'ready_for_bg_remove' | 'processing_bg'

export default function BackgroundRemover() {
  const [state, setState] = useState<State>('idle')
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [cutoutBase64, setCutoutBase64] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const uploadCanvasRef = useRef<HTMLCanvasElement>(null)

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return
    
    const file = acceptedFiles[0]
    setOriginalFile(file)
    setCutoutBase64(null)
    setState('ready_for_bg_remove')
    
    // Show the uploaded image on canvas
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result as string
      const base64Data = base64.split(',')[1]
      setCurrentImage(base64Data)
    }
    reader.readAsDataURL(file)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false
  })

  const handleRemoveBackground = async () => {
    if (!originalFile) return
    
    setState('processing_bg')
    try {
      const result = await api.removeBg(originalFile)
      setCutoutBase64(result.png_base64)
      setCurrentImage(result.png_base64)
    } catch (error) {
      console.error('Failed to remove background:', error)
      alert('Failed to remove background')
    } finally {
      setState('ready_for_bg_remove')
    }
  }

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement('a')
      link.download = 'background-removed.png'
      link.href = canvasRef.current.toDataURL()
      link.click()
    }
  }

  const handleReset = () => {
    setOriginalFile(null)
    setCutoutBase64(null)
    setCurrentImage(null)
    setState('idle')
  }

  // Common canvas setup function
  const setupCanvas = (canvas: HTMLCanvasElement, imageData: string | null, isProcessing = false) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const canvasWidth = 400
    const canvasHeight = 400
    const displaySize = 400

    // Set canvas size
    canvas.width = canvasWidth
    canvas.height = canvasHeight
    canvas.style.width = `${displaySize}px`
    canvas.style.height = `${displaySize}px`

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)

    if (imageData) {
      const img = new Image()
      img.onload = () => {
        // Calculate scaling to fit image in canvas
        const scale = Math.min(canvasWidth / img.width, canvasHeight / img.height)
        const scaledWidth = img.width * scale
        const scaledHeight = img.height * scale
        const x = (canvasWidth - scaledWidth) / 2
        const y = (canvasHeight - scaledHeight) / 2
        
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight)
        
        // Add processing overlay if in processing state
        if (isProcessing) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
          ctx.fillRect(0, 0, canvasWidth, canvasHeight)
          
          ctx.fillStyle = 'white'
          ctx.font = '20px Arial'
          ctx.textAlign = 'center'
          ctx.fillText('Removing background...', canvasWidth / 2, canvasHeight / 2)
        }
      }
      img.src = `data:image/png;base64,${imageData}`
    }
  }

  // Canvas drawing effects
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    setupCanvas(canvas, currentImage, state === 'processing_bg')
  }, [currentImage, state])

  useEffect(() => {
    const canvas = uploadCanvasRef.current
    if (!canvas) return

    // For upload canvas, show original image if available
    if (originalFile && currentImage && !cutoutBase64) {
      setupCanvas(canvas, currentImage)
    } else {
      setupCanvas(canvas, null)
    }
  }, [originalFile, currentImage, cutoutBase64])

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Remove Background from Images
        </h1>
        <p className="text-gray-600">
          Upload an image and remove the background instantly with AI
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Area */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Upload Image</h2>
          
          {state === 'idle' ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {isDragActive ? 'Drop your image here' : 'Upload an image'}
                  </h3>
                  <p className="text-gray-500 mt-1">
                    Drag and drop an image, or click to select
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Supports JPEG, PNG, WebP (max 10MB)
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Uploaded Image Canvas */}
              <div className="bg-white rounded-lg border p-4">
                <canvas
                  ref={uploadCanvasRef}
                  className="w-full border border-gray-200 rounded-lg bg-white"
                  style={{ 
                    backgroundImage: 'repeating-conic-gradient(#f0f0f0 0% 25%, #e0e0e0 0% 50%) 50% / 20px 20px'
                  }}
                />
              </div>
              
              {/* File info and remove button */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {originalFile?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {originalFile?.size ? (originalFile.size / 1024 / 1024).toFixed(2) : '0'} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
              
              {state === 'ready_for_bg_remove' && !cutoutBase64 && (
                <button
                  onClick={handleRemoveBackground}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Remove Background
                </button>
              )}
              
              {state === 'processing_bg' && (
                <div className="flex items-center justify-center space-x-2 text-blue-600">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <span>Removing background...</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Preview Area */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
          
          <div className="bg-white rounded-lg border p-4">
            <canvas
              ref={canvasRef}
              className="w-full border border-gray-200 rounded-lg bg-white"
              style={{ 
                backgroundImage: 'repeating-conic-gradient(#f0f0f0 0% 25%, #e0e0e0 0% 50%) 50% / 20px 20px'
              }}
            />
          </div>
          
          {state === 'idle' && (
            <p className="text-center text-gray-500">
              Upload an image to see the preview
            </p>
          )}
          
          {cutoutBase64 && (
            <div className="space-y-2">
              <p className="text-center text-green-600">
                Background removed successfully!
              </p>
              <button
                onClick={handleDownload}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Download Image
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
