import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { getMockColleges } from '@/lib/mockDb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Pagination Parameters
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    // Filter Parameters
    const search = searchParams.get('q') || '';
    const state = searchParams.get('state') || '';
    const city = searchParams.get('city') || '';
    const feesMin = searchParams.get('feesMin') ? parseInt(searchParams.get('feesMin')!, 10) : null;
    const feesMax = searchParams.get('feesMax') ? parseInt(searchParams.get('feesMax')!, 10) : null;
    const rating = searchParams.get('rating') ? parseFloat(searchParams.get('rating')!) : null;
    const courseType = searchParams.get('courseType') || '';
    const ownershipType = searchParams.get('ownershipType') || '';

    // Sorting Parameters
    const sortBy = searchParams.get('sortBy') || 'rating'; // rating, feesAsc, feesDesc, placements
    
    // Construct Query Conditions
    const where: Prisma.CollegeWhereInput = {};

    // 1. Text Search (Name, City, State, Course name, or Stream type)
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { state: { contains: search, mode: 'insensitive' } },
        {
          courses: {
            some: {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { type: { contains: search, mode: 'insensitive' } },
              ],
            },
          },
        },
      ];
    }

    // 2. Specific filters
    if (state) {
      where.state = { equals: state, mode: 'insensitive' };
    }
    if (city) {
      where.city = { equals: city, mode: 'insensitive' };
    }
    if (ownershipType) {
      where.ownershipType = { equals: ownershipType, mode: 'insensitive' };
    }
    if (rating !== null) {
      where.rating = { gte: rating };
    }

    // 3. Fees Range filter (match if any overlap or within bounds)
    if (feesMin !== null || feesMax !== null) {
      where.AND = [];
      if (feesMin !== null) {
        where.AND.push({ feesMax: { gte: feesMin } });
      }
      if (feesMax !== null) {
        where.AND.push({ feesMin: { lte: feesMax } });
      }
    }

    // 4. Course Type filter (e.g. Engineering, Management)
    if (courseType) {
      where.courses = {
        some: {
          type: { equals: courseType, mode: 'insensitive' },
        },
      };
    }

    // Sorting conditions
    let orderBy: Prisma.CollegeOrderByWithRelationInput = { rating: 'desc' }; // default
    if (sortBy === 'feesAsc') {
      orderBy = { feesMin: 'asc' };
    } else if (sortBy === 'feesDesc') {
      orderBy = { feesMax: 'desc' };
    } else if (sortBy === 'rating') {
      orderBy = { rating: 'desc' };
    } else if (sortBy === 'placements') {
      orderBy = { avgPackage: 'desc' };
    }

    // Execute queries in parallel
    const [colleges, totalCount] = await prisma.$transaction([
      prisma.college.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          courses: {
            take: 5,
            orderBy: { feesAnnual: 'asc' },
          },
          placements: {
            orderBy: { year: 'desc' },
            take: 1,
          },
        },
      }),
      prisma.college.count({ where }),
    ]);

    // Extra: Get all unique states and cities for filter suggestions
    const statesAndCities = await prisma.college.findMany({
      select: { state: true, city: true },
      distinct: ['state', 'city'],
    });
    
    const states = Array.from(new Set(statesAndCities.map((c) => c.state))).sort();
    const cities = Array.from(new Set(statesAndCities.map((c) => c.city))).sort();

    return NextResponse.json({
      colleges,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
      metadata: {
        states,
        cities,
      },
    });
  } catch (error) {
    console.warn('PostgreSQL failed. Falling back to mock database search:', error);
    
    // Gather query parameters for fallback matching
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const state = searchParams.get('state') || '';
    const city = searchParams.get('city') || '';
    const feesMax = searchParams.get('feesMax') || '';
    const rating = searchParams.get('rating') || '';
    const courseType = searchParams.get('courseType') || '';
    const ownershipType = searchParams.get('ownershipType') || '';
    const sortBy = searchParams.get('sortBy') || 'rating';
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '9';

    const mockResult = getMockColleges({
      q,
      state,
      city,
      feesMax,
      rating,
      courseType,
      ownershipType,
      sortBy,
      page,
      limit: parseInt(limit, 10),
    });

    return NextResponse.json(mockResult);
  }
}
