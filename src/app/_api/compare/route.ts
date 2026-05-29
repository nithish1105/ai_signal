import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mockColleges } from '@/lib/mockDb';

export async function POST(request: Request) {
  let collegeIds: string[] = [];
  try {
    const body = await request.json();
    collegeIds = body.collegeIds;
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON request body' }, { status: 400 });
  }

  if (!collegeIds || !Array.isArray(collegeIds) || collegeIds.length === 0) {
    return NextResponse.json(
      { error: 'collegeIds array is required' },
      { status: 400 }
    );
  }

  if (collegeIds.length > 3) {
    return NextResponse.json(
      { error: 'You can compare a maximum of 3 colleges at once.' },
      { status: 400 }
    );
  }

  try {
    const colleges = await prisma.college.findMany({
      where: {
        id: { in: collegeIds },
      },
      include: {
        courses: {
          orderBy: { feesAnnual: 'asc' },
        },
        placements: {
          orderBy: { year: 'desc' },
          take: 1, // Get the latest year placements
        },
      },
    });

    // Sort to match request order
    const orderedColleges = collegeIds
      .map((id) => colleges.find((c) => c.id === id))
      .filter(Boolean);

    return NextResponse.json({ colleges: orderedColleges });
  } catch (error) {
    console.warn('PostgreSQL query failed. Falling back to mock database comparison compilation:', error);
    
    // Fallback logic using in-memory mock database
    const colleges = mockColleges.filter((c) => collegeIds.includes(c.id));
    const orderedColleges = collegeIds
      .map((id) => colleges.find((c) => c.id === id))
      .filter(Boolean);

    return NextResponse.json({ colleges: orderedColleges });
  }
}
