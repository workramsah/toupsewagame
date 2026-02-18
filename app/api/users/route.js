import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// GET all users
export async function GET() {
  if (!prisma) {
    return NextResponse.json(
      { success: false, message: 'Database not configured. Set DATABASE_URL in .env or .env.local.' },
      { status: 503 }
    );
  }
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(
      { success: true, data: users },
      { status: 200 }
    );
  } catch (error) {
    if (error.code === 'P2022') {
      try {
        const rows = await prisma.$queryRaw`
          SELECT id, uid, name, whatsappnum, imageUrl, createdAt, updatedAt
          FROM users
          ORDER BY createdAt DESC
        `;
        const users = (rows || []).map((row) => ({
          ...row,
          status: 'pending',
        }));
        return NextResponse.json(
          { success: true, data: users },
          { status: 200 }
        );
      } catch (rawError) {
        console.error('Raw query fallback failed:', rawError);
        return NextResponse.json(
          {
            success: false,
            message: 'Database schema is out of date. Run: npx prisma migrate deploy',
            error: error.message,
          },
          { status: 500 }
        );
      }
    }
    console.error('Error fetching users:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch users',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

