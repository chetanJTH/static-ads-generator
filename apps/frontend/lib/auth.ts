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
import { authenticateUser } from './auth-sqlite-new'

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
        }
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
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await authenticateUser(credentials.email, credentials.password);
          return user as any;
        } catch (error) {
          console.error('Authentication error:', error)
          return null
        }
      }
    })
  ],

  // Use JWT strategy for sessions (stateless, good for serverless)
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
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
  
  // Debug mode for development
  debug: process.env.NODE_ENV === 'development',
}
