import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// PUT - Update user
export async function PUT(request, { params }) {
  if (!prisma) {
    return NextResponse.json(
      { success: false, message: 'Database not configured. Set DATABASE_URL in .env or .env.local.' },
      { status: 503 }
    );
  }
  try {
    const { id } = await params;
    const numId = parseInt(id, 10);
    if (Number.isNaN(numId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid user ID' },
        { status: 400 }
      );
    }
    const body = await request.json();
    const { name, whatsappnum, imageUrl, uid, status } = body;

    // Build update data (only include provided fields)
    const data = {};
    if (uid !== undefined) data.uid = String(uid).trim();
    if (name !== undefined) data.name = String(name).trim();
    if (whatsappnum !== undefined) data.whatsappnum = String(whatsappnum).trim();
    if (imageUrl !== undefined) data.imageUrl = imageUrl ? String(imageUrl).trim() : null;
    if (status !== undefined) {
      const validStatuses = ['pending', 'incomplete', 'complete'];
      if (validStatuses.includes(String(status).toLowerCase())) {
        data.status = String(status).toLowerCase();
      }
    }

    // For full PUT, require uid, name, whatsappnum if we're doing a full replace
    const isPartialUpdate = Object.keys(body).length <= 1 && body.status !== undefined;
    if (!isPartialUpdate && (!name || !whatsappnum || !uid)) {
      return NextResponse.json(
        { success: false, message: 'All fields are required (uid, name, whatsappnum) for full update' },
        { status: 400 }
      );
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { success: false, message: 'No valid fields to update' },
        { status: 400 }
      );
    }

    // Update user in database
    const user = await prisma.user.update({
      where: { id: numId },
      data,
    });

    return NextResponse.json(
      { success: true, message: 'User updated successfully', data: user },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating user:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0] || 'field';
      return NextResponse.json(
        { success: false, message: `${field} already exists` },
        { status: 409 }
      );
    }

    if (error.code === 'P2022') {
      return NextResponse.json(
        {
          success: false,
          message: 'Database schema is out of date. Run: npx prisma migrate deploy',
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update user',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete user
export async function DELETE(request, { params }) {
  if (!prisma) {
    return NextResponse.json(
      { success: false, message: 'Database not configured. Set DATABASE_URL in .env or .env.local.' },
      { status: 503 }
    );
  }
  try {
    const { id } = await params;
    const numId = parseInt(id, 10);
    if (Number.isNaN(numId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid user ID' },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id: numId },
    });

    return NextResponse.json(
      { success: true, message: 'User deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting user:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to delete user', 
        error: error.message 
      },
      { status: 500 }
    );
  }
}

