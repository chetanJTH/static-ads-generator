import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function DELETE(req: NextRequest) {
  try {
    // Get session to verify authentication
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Delete user and all related data
    // Prisma will handle cascading deletes based on schema relationships
    await prisma.user.delete({
      where: { id: session.user.id }
    })

    return NextResponse.json(
      { message: 'Account deleted successfully' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Delete account error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

