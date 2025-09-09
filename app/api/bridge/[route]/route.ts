import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(
  request: NextRequest,
  { params }: { params: { route: string[] } }
) {
  return handleRequest(request, params.route, 'GET')
}

export async function POST(
  request: NextRequest,
  { params }: { params: { route: string[] } }
) {
  return handleRequest(request, params.route, 'POST')
}

async function handleRequest(
  request: NextRequest,
  route: string[],
  method: string
) {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'
    const routePath = route.join('/')
    const url = `${apiBase}/${routePath}`
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const queryString = searchParams.toString()
    const fullUrl = queryString ? `${url}?${queryString}` : url
    
    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': request.headers.get('content-type') || 'application/json',
    }
    
    // Copy relevant headers
    const relevantHeaders = ['authorization', 'user-agent']
    for (const header of relevantHeaders) {
      const value = request.headers.get(header)
      if (value) {
        headers[header] = value
      }
    }
    
    // Prepare axios config
    const axiosConfig: any = {
      method: method.toLowerCase() as any,
      url: fullUrl,
      headers,
      responseType: 'text',
    }
    
    // Add body for POST requests
    if (method === 'POST') {
      const contentType = request.headers.get('content-type')
      if (contentType?.includes('multipart/form-data')) {
        // Handle file uploads
        const formData = await request.formData()
        axiosConfig.data = formData
        // Don't set Content-Type for FormData, let axios set it with boundary
        delete headers['Content-Type']
      } else {
        // Handle JSON
        const body = await request.text()
        if (body) {
          axiosConfig.data = body
        }
      }
    }
    
    // Make request to FastAPI using axios
    const response = await axios(axiosConfig)
    
    // Create new response
    const newResponse = new NextResponse(response.data, {
      status: response.status,
      statusText: response.statusText,
    })
    
    // Copy response headers
    Object.entries(response.headers).forEach(([key, value]) => {
      if (typeof value === 'string') {
        newResponse.headers.set(key, value)
      }
    })
    
    return newResponse
    
  } catch (error) {
    console.error('API bridge error:', error)
    
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500
      const data = error.response?.data || 'Internal server error'
      return NextResponse.json(
        { error: data },
        { status }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
