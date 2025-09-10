export interface RemoveBgResponse {
  png_base64: string
}

export const api = {
  async removeBg(file: File): Promise<RemoveBgResponse> {
    const formData = new FormData()
    formData.append('file', file)

    // Use Next.js rewrites instead of direct backend calls
    const response = await fetch('/api/remove-bg', {
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
    // Use Next.js rewrites instead of direct backend calls
    const response = await fetch('/api/health')
    return response.json()
  },
}
