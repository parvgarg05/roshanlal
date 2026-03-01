import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { label: 'asc' },
            include: {
                _count: {
                    select: { products: true },
                },
            },
        });

        return NextResponse.json({ categories });
    } catch (error) {
        console.error('[get-categories]', error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, label, labelHindi, emoji, description, gstRate } = body;

        if (!id || !label || !labelHindi || !emoji) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const category = await prisma.category.create({
            data: {
                id,
                label,
                labelHindi,
                emoji,
                description: description || '',
                gstRate: parseInt(gstRate) || 5,
            },
        });

        return NextResponse.json({ category });
    } catch (error: any) {
        console.error('[create-category]', error);
        if (error?.code === 'P2002') {
            return NextResponse.json({ error: 'Category with this ID already exists' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Category ID required' }, { status: 400 });
        }

        // Check if category has products
        const productCount = await prisma.product.count({
            where: { categoryId: id },
        });

        if (productCount > 0) {
            return NextResponse.json({ 
                error: `Cannot delete category with ${productCount} products. Move or delete products first.` 
            }, { status: 400 });
        }

        await prisma.category.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('[delete-category]', error);
        if (error?.code === 'P2025') {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    }
}
