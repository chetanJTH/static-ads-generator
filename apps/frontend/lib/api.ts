import axios from 'axios'

// Use HTTPS backend directly since SSL is now configured
const API_BASE = process.env.NODE_ENV === 'production' ? 'https://staticapi.kraftey.com' : (process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000')

export interface RemoveBgResponse {
  png_base64: string
}

export interface UploadResponse {
  message: string
  filename: string
  url: string
  size: number
  type: string
  cloud_storage: string
  replicate_accessible: boolean
}

export interface ReplicateBgRemovalRequest {
  image_url: string
}

export interface ReplicateBgRemovalResponse {
  task_id: string
  status: string
  message: string
  processed_url?: string
  original_url: string
  created_at: string
  processing_time?: number
  replicate_model_info?: {
    model: string
    version: string
    description: string
    output_format: string
    suitable_for?: string[]
  }
}

export const api = {
  // Legacy background removal (using rembg)
  async removeBg(file: File): Promise<RemoveBgResponse> {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post(`${API_BASE}/remove-bg/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data || error.message || 'Failed to remove background'
        throw new Error(errorMessage)
      }
      throw error
    }
  },

  // Upload file to get public URL for Replicate
  async uploadFile(file: File): Promise<UploadResponse> {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post(`${API_BASE}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.detail || error.message || 'Failed to upload file'
        throw new Error(errorMessage)
      }
      throw error
    }
  },

  // New Replicate-based background removal (sync)
  async removeBgReplicate(imageUrl: string): Promise<ReplicateBgRemovalResponse> {
    try {
      const response = await axios.post(`${API_BASE}/api/remove-bg/sync`, {
        image_url: imageUrl
      })
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.detail || error.message || 'Failed to remove background with Replicate'
        throw new Error(errorMessage)
      }
      throw error
    }
  },

  // New Replicate-based background removal (async)
  async removeBgReplicateAsync(imageUrl: string): Promise<ReplicateBgRemovalResponse> {
    try {
      const response = await axios.post(`${API_BASE}/api/remove-bg`, {
        image_url: imageUrl
      })
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.detail || error.message || 'Failed to start background removal'
        throw new Error(errorMessage)
      }
      throw error
    }
  },

  // Get background removal task status
  async getBgRemovalStatus(taskId: string): Promise<ReplicateBgRemovalResponse> {
    try {
      const response = await axios.get(`${API_BASE}/api/remove-bg/status/${taskId}`)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.detail || error.message || 'Failed to get task status'
        throw new Error(errorMessage)
      }
      throw error
    }
  },

  async health(): Promise<{ ok: boolean }> {
    try {
      const response = await axios.get(`${API_BASE}/health/`)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data || error.message || 'Health check failed'
        throw new Error(errorMessage)
      }
      throw error
    }
  },
}
