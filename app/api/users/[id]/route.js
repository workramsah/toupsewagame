import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// PUT - Update user
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, whatsappnum, imageUrl, uid } = body;

    // Validate required fields
    if (!name || !whatsappnum || !uid) {
      return NextResponse.json(
        { success: false, message: 'All fields are required (uid, name, whatsappnum)' },
        { status: 400 }
      );
    }

    // Update user in database
    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        uid: String(uid).trim(),
        name: String(name).trim(),
        whatsappnum: String(whatsappnum).trim(),
        imageUrl: imageUrl ? String(imageUrl).trim() : null,
      },
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

    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update user', 
        error: error.message 
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete user
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Delete user from database
    await prisma.user.delete({
      where: { id: parseInt(id) },
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

