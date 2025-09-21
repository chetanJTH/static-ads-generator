/**
 * NextAuth.js Route Handler
 * 
 * This file handles the NextAuth.js API routes for authentication.
 * The actual configuration is imported from @/lib/auth.ts
 */

import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }