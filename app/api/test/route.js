import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

function bad(message, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

export async function POST(request) {
  if (!prisma) {
    return bad('Database not configured. Set DATABASE_URL in .env or .env.local.', 503);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return bad('Invalid JSON body');
  }

  const { uid, name, whatsappnum, imageUrl, price } = body;
  const priceNum = parseInt(String(price ?? ''), 10);

  const u = String(uid ?? '').trim();
  const n = String(name ?? '').trim();
  const w = String(whatsappnum ?? '').trim();
  const img = imageUrl ? String(imageUrl).trim() : null;

  if (!u || !n || !w || Number.isNaN(priceNum)) {
    return bad('uid, name, whatsappnum, and a valid price are required');
  }

  try {
    const user = await prisma.user.create({
      data: {
        uid: u,
        name: n,
        whatsappnum: w,
        price: priceNum,
        imageUrl: img || null,
      },
    });
    return NextResponse.json(
      { success: true, message: 'User created successfully', data: user },
      { status: 201 }
    );
  } catch (e) {
    if (e.code === 'P2002') {
      return bad('That UID is already registered', 409);
    }
    if (e.code === 'P2022') {
      return bad('Database is missing columns (e.g. price). Run: npx prisma migrate dev', 500);
    }
    return bad('Failed to create user', 500);
  }
}
