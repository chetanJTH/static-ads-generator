import axios from 'axios'

// Use HTTPS backend directly since SSL is now configured
const API_BASE = process.env.NODE_ENV === 'production' ? 'https://staticapi.kraftey.com' : (process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000')

export interface RemoveBgResponse {
  png_base64: string
}

export const api = {
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
