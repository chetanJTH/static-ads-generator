/**
 * User Registration API Route
 * 
 * Handles user account creation with email/password credentials.
 * Creates user with free subscription and initializes usage statistics.
 */

import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Zod schema for input validation
// Ensures data integrity and provides clear error messages
const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
})

/**
 * POST Handler for User Registration
 * 
 * Creates a new user account with the following features:
 * - Input validation using Zod schema
 * - Password hashing with bcrypt
 * - Automatic free subscription creation
 * - Usage statistics initialization
 * - Duplicate email checking
 * 
 * @param req - Next.js request object containing user registration data
 * @returns JSON response with user data or error message
 */
export async function POST(req: NextRequest) {
  try {
    // Parse and validate request body
    const body = await req.json()
    const { name, email, password } = signupSchema.parse(body)

    // Check if user already exists with this email
    // Prevents duplicate accounts and maintains email uniqueness
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password using bcrypt with salt rounds of 12
    // Higher salt rounds = more secure but slower processing
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user with related records in a single transaction
    // This ensures data consistency across multiple tables
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        
        // Create free subscription for new user
        // All users start with a free plan by default
        subscription: {
          create: {
            plan: 'free',
            status: 'active'
          }
        },
        
        // Initialize usage statistics tracking
        // Tracks feature usage for premium limits and analytics
        usageStats: {
          create: {
            backgroundRemovalCount: 0,
            imageUpscaleCount: 0,
            imageEditingCount: 0,
            watermarkRemovalCount: 0,
            apiCallsCount: 0
          }
        }
      },
      
      // Only return safe user data (no password or sensitive info)
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    })

    // Return success response with user data
    return NextResponse.json({
      message: 'User created successfully',
      user
    }, { status: 201 })

  } catch (error) {
    // Handle validation errors from Zod schema
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    // Log server errors for debugging (don't expose to client)
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

