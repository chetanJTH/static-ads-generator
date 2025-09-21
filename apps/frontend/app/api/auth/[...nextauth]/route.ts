/**
 * NextAuth.js Configuration
 * 
 * This file configures authentication for the application using NextAuth.js.
 * It supports both OAuth (Google) and credential-based authentication with
 * subscription management integration.
 */

import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// NextAuth configuration object
const authOptions: NextAuthOptions = {
  // Use Prisma adapter for database integration
  // This automatically handles user, account, and session management
  adapter: PrismaAdapter(prisma),
  
  // Authentication providers configuration
  providers: [
    // Google OAuth Provider
    // Allows users to sign in with their Google account
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    
    // Credentials Provider for email/password authentication
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      
      /**
       * Authorization function for credential-based login
       * @param credentials - Email and password from login form
       * @returns User object if authentication successful, null otherwise
       */
      async authorize(credentials) {
        // Validate that both email and password are provided
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }

        // Find user in database by email, including subscription data
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          },
          include: {
            subscription: true  // Include subscription info for premium features
          }
        })

        // Check if user exists and has a password (not OAuth-only account)
        if (!user || !user.password) {
          throw new Error('Invalid credentials')
        }

        // Verify password using bcrypt
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error('Invalid credentials')
        }

        // Return user object with subscription information
        // This data will be available in JWT token and session
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          subscriptionStatus: user.subscription?.status || 'free',
          subscriptionPlan: user.subscription?.plan || 'free'
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
  },
  
  // Secret for JWT encryption - must be set in environment variables
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
