import { NextRequest, NextResponse } from 'next/server'

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
    const headers: HeadersInit = {
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
    
    // Prepare request options
    const options: RequestInit = {
      method,
      headers,
    }
    
    // Add body for POST requests
    if (method === 'POST') {
      const contentType = request.headers.get('content-type')
      if (contentType?.includes('multipart/form-data')) {
        // Handle file uploads
        const formData = await request.formData()
        options.body = formData
        // Don't set Content-Type for FormData, let the browser set it with boundary
        delete headers['Content-Type']
      } else {
        // Handle JSON
        const body = await request.text()
        if (body) {
          options.body = body
        }
      }
    }
    
    // Make request to FastAPI
    const response = await fetch(fullUrl, options)
    
    // Get response data
    const responseData = await response.text()
    
    // Create new response
    const newResponse = new NextResponse(responseData, {
      status: response.status,
      statusText: response.statusText,
    })
    
    // Copy response headers
    response.headers.forEach((value, key) => {
      newResponse.headers.set(key, value)
    })
    
    return newResponse
    
  } catch (error) {
    console.error('API bridge error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
