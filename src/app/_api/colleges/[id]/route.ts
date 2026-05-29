import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getMockCollegeByIdOrSlug } from '@/lib/mockDb';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch college by id or slug
    const college = await prisma.college.findFirst({
      where: {
        OR: [
          { id },
          { slug: id },
        ],
      },
      include: {
        courses: {
          orderBy: { feesAnnual: 'asc' },
        },
        placements: {
          orderBy: { year: 'asc' }, // Ascending so charts draw left-to-right (chronological)
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!college) {
      return NextResponse.json(
        { error: 'College not found' },
        { status: 404 }
      );
    }

    // Aggregate rating distributions (1, 2, 3, 4, 5 stars)
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    
    college.reviews.forEach((review) => {
      const roundedRating = Math.round(review.rating) as 1 | 2 | 3 | 4 | 5;
      if (roundedRating >= 1 && roundedRating <= 5) {
        distribution[roundedRating]++;
      }
    });

    const reviewsCount = college.reviews.length;
    const ratingDistribution = Object.entries(distribution).map(([stars, count]) => ({
      stars: parseInt(stars, 10),
      count,
      percentage: reviewsCount > 0 ? parseFloat(((count / reviewsCount) * 100).toFixed(1)) : 0,
    })).reverse(); // From 5 stars down to 1 star

    return NextResponse.json({
      college,
      ratingSummary: {
        averageRating: college.rating,
        totalReviews: reviewsCount,
        distribution: ratingDistribution,
      },
    });
  } catch (error) {
    console.warn('PostgreSQL query failed. Falling back to mock database profile load:', error);
    try {
      const { id } = await params;
      const mockData = getMockCollegeByIdOrSlug(id);
      
      if (!mockData) {
        return NextResponse.json(
          { error: 'College not found in mock database' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(mockData);
    } catch (fallbackError) {
      console.error('Fallback error:', fallbackError);
      return NextResponse.json(
        { error: 'An error occurred while fetching the college details.' },
        { status: 500 }
      );
    }
  }
}
