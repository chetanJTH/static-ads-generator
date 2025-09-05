import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    demo: {
      id: "demo",
      name: "Demo",
      type: "credentials",
      signinUrl: "/api/auth/signin/demo",
      callbackUrl: "/api/auth/callback/demo"
    }
  })
}



