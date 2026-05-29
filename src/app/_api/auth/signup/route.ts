import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { mockSignup } from '@/lib/mockDb';

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    // Basic Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 400 }
        );
      }

      // Create User
      const user = await prisma.user.create({
        data: {
          email,
          name,
          passwordHash,
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      });

      return NextResponse.json(
        { message: 'User registered successfully', user },
        { status: 201 }
      );
    } catch (dbError) {
      console.warn('PostgreSQL write failed. Falling back to mock signup storage:', dbError);
      
      const user = mockSignup(name, email, passwordHash);
      if (!user) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { 
          message: 'User registered successfully (mock mode)', 
          user: { id: user.id, email: user.email, name: user.name } 
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error occurred' },
      { status: 500 }
    );
  }
}
