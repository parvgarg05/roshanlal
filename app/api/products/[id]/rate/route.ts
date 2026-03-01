import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: productId } = await params;
        const body = await req.json();
        const rating = parseInt(body?.rating || '0', 10);

        if (!rating || rating < 1 || rating > 5) {
            return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
        }

        // Allow anonymous ratings
        const customerId: string | null = null;

        // Create rating record
        await prisma.productRating.create({
            data: {
                productId,
                customerId,
                rating,
            },
        });

        // Calculate new average rating
        const ratings = await prisma.productRating.findMany({
            where: { productId },
            select: { rating: true },
        });

        const avgRating = ratings.length > 0
            ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
            : 5.0;

        // Update product with new rating
        await prisma.product.update({
            where: { id: productId },
            data: {
                rating: Math.round(avgRating * 10) / 10,
                reviewCount: ratings.length,
            },
        });

        return NextResponse.json({ 
            success: true, 
            rating: Math.round(avgRating * 10) / 10,
            reviewCount: ratings.length 
        });
    } catch (error) {
        console.error('[rate-product]', error);
        return NextResponse.json({ error: 'Failed to submit rating' }, { status: 500 });
    }
}
