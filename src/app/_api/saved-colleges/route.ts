import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyAccessToken } from '@/lib/jwt';
import { getMockSavedColleges, mockSaveCollege, mockRemoveSavedCollege } from '@/lib/mockDb';

// Helper to get authenticated user ID
async function getUserIdFromToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  if (!token) return null;
  const decoded = verifyAccessToken(token);
  return decoded ? decoded.userId : null;
}

// 1. GET User's Bookmarked Colleges
export async function GET() {
  const userId = await getUserIdFromToken();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const saved = await prisma.savedCollege.findMany({
      where: { userId },
      include: {
        college: {
          include: {
            courses: {
              take: 3,
              orderBy: { feesAnnual: 'asc' },
            },
            placements: {
              orderBy: { year: 'desc' },
              take: 1,
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Flatten to return colleges directly
    const colleges = saved.map((s) => s.college);

    return NextResponse.json({ colleges });
  } catch (error) {
    console.warn('PostgreSQL query failed. Falling back to mock saved colleges list:', error);
    const colleges = getMockSavedColleges(userId);
    return NextResponse.json({ colleges });
  }
}

// 2. Add College to Bookmarks
export async function POST(request: Request) {
  const userId = await getUserIdFromToken();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let collegeId = '';
  try {
    const body = await request.json();
    collegeId = body.collegeId;
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON request body' }, { status: 400 });
  }

  if (!collegeId) {
    return NextResponse.json({ error: 'College ID is required' }, { status: 400 });
  }

  try {
    // Verify college exists
    const college = await prisma.college.findUnique({
      where: { id: collegeId },
    });
    if (!college) {
      return NextResponse.json({ error: 'College not found' }, { status: 404 });
    }

    // Upsert/Create link
    const saved = await prisma.savedCollege.upsert({
      where: {
        userId_collegeId: {
          userId,
          collegeId,
        },
      },
      update: {}, // Do nothing if already bookmarked
      create: {
        userId,
        collegeId,
      },
    });

    return NextResponse.json(
      { message: 'College bookmarked successfully', saved },
      { status: 201 }
    );
  } catch (error) {
    console.warn('PostgreSQL write failed. Falling back to mock database bookmarking:', error);
    mockSaveCollege(userId, collegeId);
    return NextResponse.json(
      { message: 'College bookmarked successfully (mock mode)' },
      { status: 201 }
    );
  }
}

// 3. Remove College from Bookmarks
export async function DELETE(request: Request) {
  const userId = await getUserIdFromToken();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const collegeId = searchParams.get('collegeId');

  if (!collegeId) {
    return NextResponse.json({ error: 'College ID is required' }, { status: 400 });
  }

  try {
    await prisma.savedCollege.delete({
      where: {
        userId_collegeId: {
          userId,
          collegeId,
        },
      },
    });

    return NextResponse.json({ message: 'College removed from bookmarks' });
  } catch (error) {
    console.warn('PostgreSQL delete failed. Falling back to mock database bookmark removal:', error);
    mockRemoveSavedCollege(userId, collegeId);
    return NextResponse.json({ message: 'College removed from bookmarks (mock mode)' });
  }
}
