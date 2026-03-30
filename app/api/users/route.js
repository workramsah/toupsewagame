import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

function bad(message, status = 500) {
  return NextResponse.json({ success: false, message }, { status });
}

/** GET /api/users — list all users, newest first */
export async function GET() {
  if (!prisma) {
    return bad('Database not configured. Set DATABASE_URL in .env or .env.local.', 503);
  }

  try {
    const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ success: true, data: users });
  } catch (e) {
    if (e.code === 'P2022') {
      return bad('Database schema is out of date. Run: npx prisma migrate dev', 500);
    }
    return bad('Failed to fetch users', 500);
  }
}
