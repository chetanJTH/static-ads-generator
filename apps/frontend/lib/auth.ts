/**
 * NextAuth.js Configuration
 * 
 * This file contains the authentication configuration for NextAuth.js.
 * It supports both OAuth (Google) and credential-based authentication with
 * subscription management integration.
 */

import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// NextAuth configuration object
export const authOptions: NextAuthOptions = {
  // Remove PrismaAdapter to avoid conflicts
  // adapter: PrismaAdapter(prisma),
  
  // Configure authentication providers
  providers: [
    // Only include Google OAuth if credentials are available
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      /**
       * Google OAuth Provider
       * Allows users to sign in with their Google account
       */
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code"
          }
        },
        // Fix callback URL issue
        redirect_uri: process.env.NEXTAUTH_URL + '/api/auth/callback/google'
      })
    ] : []),
    
    /**
     * Credentials Provider
     * Allows users to sign in with email/password
     */
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { 
          label: 'Email', 
          type: 'email',
          placeholder: 'Enter your email'
        },
        password: { 
          label: 'Password', 
          type: 'password',
          placeholder: 'Enter your password'
        }
      },
      async authorize(credentials) {
        console.log('🔐 [AUTH DEBUG] Starting authentication process')
        console.log('🔐 [AUTH DEBUG] Credentials received:', { email: credentials?.email, hasPassword: !!credentials?.password })
        
        // Validate that credentials are provided
        if (!credentials?.email || !credentials?.password) {
          console.log('🔐 [AUTH DEBUG] Missing credentials')
          throw new Error('Please provide both email and password')
        }

        try {
          console.log('🔐 [AUTH DEBUG] Looking up user in database...')
          
          // Find user in database by email
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          })

          console.log('🔐 [AUTH DEBUG] User found:', { 
            exists: !!user, 
            hasPassword: !!user?.password,
            userId: user?.id,
            userEmail: user?.email 
          })

          // Check if user exists and has a password (not OAuth-only user)
          if (!user || !user.password) {
            console.log('🔐 [AUTH DEBUG] User not found or no password')
            throw new Error('Invalid email or password')
          }

          console.log('🔐 [AUTH DEBUG] Verifying password...')
          
          // Verify password using bcrypt
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
          
          console.log('🔐 [AUTH DEBUG] Password verification result:', isPasswordValid)
          
          if (!isPasswordValid) {
            console.log('🔐 [AUTH DEBUG] Password verification failed')
            throw new Error('Invalid email or password')
          }

          console.log('🔐 [AUTH DEBUG] Authentication successful, returning user object')

          // Return user object (without password) for session
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            subscriptionStatus: (user as any).subscription?.status || 'free',
            subscriptionPlan: (user as any).subscription?.plan || 'free',
          }
        } catch (error) {
          console.error('🔐 [AUTH DEBUG] Authentication error:', error)
          console.error('🔐 [AUTH DEBUG] Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
          })
          throw new Error('Authentication failed')
        }
      }
    })
  ],

  // Use JWT strategy for sessions (stateless, good for serverless)
  session: {
    strategy: 'jwt',
  },
  
  // Custom page routes for authentication
  pages: {
    signIn: '/auth/signin',    // Custom sign-in page
    // Note: NextAuth doesn't have a built-in signUp page option
    // Sign-up is handled through our custom /auth/signup page
  },
  
  // Callback functions to customize JWT and session behavior
  callbacks: {
    /**
     * JWT Callback - Called when JWT is created/updated
     * Used to add custom data to the JWT token
     */
    async jwt({ token, user, account }) {
      // Add subscription info to token when user signs in
      if (user) {
        token.subscriptionStatus = (user as any).subscriptionStatus
        token.subscriptionPlan = (user as any).subscriptionPlan
      }
      return token
    },
    
    /**
     * Session Callback - Called when session is accessed
     * Used to add custom data from JWT to the session object
     */
    async session({ session, token }) {
      // Add user ID and subscription info to session
      if (session.user && token.sub) {
        (session.user as any).id = token.sub;
        (session.user as any).subscriptionStatus = token.subscriptionStatus;
        (session.user as any).subscriptionPlan = token.subscriptionPlan
      }
      return session
    },
    
    /**
     * Redirect Callback - Handle where to redirect after login
     */
    async redirect({ url, baseUrl }) {
      // If it's a relative URL, make it absolute
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // If it's the same origin, allow it
      else if (new URL(url).origin === baseUrl) return url
      // Otherwise redirect to home
      return baseUrl
    },
  },
  
  // Secret for JWT encryption - must be set in environment variables
  secret: process.env.NEXTAUTH_SECRET,
}
