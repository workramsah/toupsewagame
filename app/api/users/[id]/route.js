import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

function bad(message, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

const STATUSES = new Set(['pending', 'incomplete', 'complete']);

function parseId(id) {
  const n = parseInt(id, 10);
  return Number.isNaN(n) ? null : n;
}

/** Build Prisma update data from JSON body (only known fields). */
function patchFromBody(body) {
  const data = {};

  if (body.uid !== undefined) data.uid = String(body.uid).trim();
  if (body.name !== undefined) data.name = String(body.name).trim();
  if (body.whatsappnum !== undefined) data.whatsappnum = String(body.whatsappnum).trim();
  if (body.imageUrl !== undefined) {
    data.imageUrl = body.imageUrl ? String(body.imageUrl).trim() : null;
  }
  if (body.price !== undefined && body.price !== null && body.price !== '') {
    const p = parseInt(String(body.price), 10);
    if (!Number.isNaN(p)) data.price = p;
  }
  if (body.status !== undefined) {
    const s = String(body.status).toLowerCase();
    if (STATUSES.has(s)) data.status = s;
  }

  return data;
}

export async function PUT(request, { params }) {
  if (!prisma) {
    return bad('Database not configured. Set DATABASE_URL in .env or .env.local.', 503);
  }

  const { id } = await params;
  const numId = parseId(id);
  if (numId == null) return bad('Invalid user ID');

  let body;
  try {
    body = await request.json();
  } catch {
    return bad('Invalid JSON body');
  }

  const data = patchFromBody(body);
  if (Object.keys(data).length === 0) {
    return bad('No valid fields to update');
  }

  try {
    const user = await prisma.user.update({ where: { id: numId }, data });
    return NextResponse.json({ success: true, message: 'User updated', data: user });
  } catch (e) {
    if (e.code === 'P2025') return bad('User not found', 404);
    if (e.code === 'P2002') return bad('That UID is already taken', 409);
    if (e.code === 'P2022') {
      return bad('Database schema is out of date. Run: npx prisma migrate dev', 500);
    }
    return bad('Failed to update user', 500);
  }
}

export async function DELETE(request, { params }) {
  if (!prisma) {
    return bad('Database not configured. Set DATABASE_URL in .env or .env.local.', 503);
  }

  const { id } = await params;
  const numId = parseId(id);
  if (numId == null) return bad('Invalid user ID');

  try {
    await prisma.user.delete({ where: { id: numId } });
    return NextResponse.json({ success: true, message: 'User deleted' });
  } catch (e) {
    if (e.code === 'P2025') return bad('User not found', 404);
    return bad('Failed to delete user', 500);
  }
}
