import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering to prevent static generation timeout
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const backendUrl = 'http://staticapi.kraftey.com'
    
    // Get the form data from the request
    const formData = await request.formData()
    
    // Forward the request to the backend
    const response = await fetch(`${backendUrl}/remove-bg`, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type, let fetch handle it for FormData
      },
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: errorText || 'Backend request failed' },
        { status: response.status }
      )
    }
    
    const data = await response.json()
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
