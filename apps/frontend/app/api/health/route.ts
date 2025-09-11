import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering to prevent static generation timeout
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'https://staticapi.kraftey.com'
    
    // Check backend health
    const backendHealth = await fetch(`${apiBase}/health/detailed`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).catch(() => null)
    
    const backendStatus = backendHealth?.ok ? await backendHealth.json() : null
    
    // Check frontend status
    const frontendStatus = {
      ok: true,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
    }
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        frontend: frontendStatus,
        backend: backendStatus || { ok: false, error: 'Backend unreachable' }
      },
      overall_health: backendStatus?.ok && frontendStatus.ok
    })
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}