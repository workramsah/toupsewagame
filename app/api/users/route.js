import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// GET all users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(
      { success: true, data: users },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch users', 
        error: error.message 
      },
      { status: 500 }
    );
  }
}

