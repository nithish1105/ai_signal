import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const decoded = verifyAccessToken(token);

    if (!decoded) {
      return NextResponse.json({ user: null });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      });

      if (!user) {
        return NextResponse.json({ user: null });
      }

      return NextResponse.json({ user });
    } catch (dbError) {
      console.warn('PostgreSQL query failed. Restoring session details from JWT payload:', dbError);
      
      // Decoded token contains user name and email. Return it directly to preserve offline session.
      return NextResponse.json({
        user: {
          id: decoded.userId,
          email: decoded.email,
          name: decoded.name,
        }
      });
    }
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ user: null });
  }
}
