import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function POST(request) {
  try {
    // Check if DATABASE_URL is available
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      console.error('DATABASE_URL is not set in environment variables');
      console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('DATABASE')));
      return NextResponse.json(
        { 
          success: false, 
          message: 'Database configuration error. DATABASE_URL is not set. Please check your .env.local file.' 
        },
        { status: 500 }
      );
    }
    
    console.log('DATABASE_URL is set:', databaseUrl ? 'Yes (hidden)' : 'No');

    // Validate prisma client is available
    if (!prisma || typeof prisma.user === 'undefined') {
      console.error('Prisma client is not initialized or User model not available');
      return NextResponse.json(
        { 
          success: false, 
          message: 'Database client not initialized. Please restart the server.' 
        },
        { status: 500 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { uid, name, whatsappnum, imageUrl } = body;

    // Validate required fields
    if (!uid || !name || !whatsappnum) {
      return NextResponse.json(
        { success: false, message: 'All fields are required (uid, name, whatsappnum)' },
        { status: 400 }
      );
    }

    // Trim whitespace from inputs
    const trimmedUid = String(uid).trim();
    const trimmedName = String(name).trim();
    const trimmedWhatsapp = String(whatsappnum).trim();
    const trimmedImageUrl = imageUrl ? String(imageUrl).trim() : null;

    // Validate trimmed values are not empty
    if (!trimmedUid || !trimmedName || !trimmedWhatsapp) {
      return NextResponse.json(
        { success: false, message: 'All fields must have non-empty values' },
        { status: 400 }
      );
    }

    // Create user in database
    const user = await prisma.user.create({
      data: {
        uid: trimmedUid,
        name: trimmedName,
        whatsappnum: trimmedWhatsapp,
        imageUrl: trimmedImageUrl || null,
      },
    });

    return NextResponse.json(
      { success: true, message: 'User created successfully', data: user },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', {
      name: error.name,
      code: error.code,
      meta: error.meta,
      message: error.message,
    });
    
    // Handle unique constraint violation
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0] || 'field';
      return NextResponse.json(
        { success: false, message: `${field} already exists` },
        { status: 409 }
      );
    }

    // Handle Prisma client errors
    if (error.name === 'PrismaClientInitializationError' || error.code === 'P1001') {
      return NextResponse.json(
        { success: false, message: 'Database connection error. Please check your database configuration.' },
        { status: 500 }
      );
    }

    // Handle table doesn't exist error
    if (error.code === 'P2021' || error.code === 'P2025') {
      return NextResponse.json(
        { success: false, message: 'Database table not found. Please run migrations.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create user', 
        error: error.message || 'Unknown error occurred',
        code: error.code || 'UNKNOWN'
      },
      { status: 500 }
    );
  }
}

