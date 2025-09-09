const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'

export interface RemoveBgResponse {
  png_base64: string
}



export const api = {
  async removeBg(file: File): Promise<RemoveBgResponse> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${API_BASE}/remove-bg`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || 'Failed to remove background')
    }

    return response.json()
  },



  async health(): Promise<{ ok: boolean }> {
    const response = await fetch(`${API_BASE}/health`)
    return response.json()
  },
}
