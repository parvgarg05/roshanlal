import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import EditProductForm from './EditProductForm';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const [product, categories] = await Promise.all([
        prisma.product.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                nameHindi: true,
                slug: true,
                description: true,
                price: true,
                categoryId: true,
                image: true,
                weightGrams: true,
                shelfLifeDays: true,
                isVeg: true,
                isAvailable: true,
                isFeatured: true,
                isTodaySpecial: true,
                allergens: true,
                ingredients: true,
            },
        }),
        prisma.category.findMany({
            orderBy: { label: 'asc' },
            select: {
                id: true,
                label: true,
                emoji: true,
            },
        }),
    ]);

    if (!product) {
        notFound();
    }

    return <EditProductForm product={product} categories={categories} />;
}
