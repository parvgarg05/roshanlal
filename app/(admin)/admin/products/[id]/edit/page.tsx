import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import EditProductForm from './EditProductForm';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const product = await prisma.product.findUnique({
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
    });

    if (!product) {
        notFound();
    }

    const categories = await prisma.category.findMany({
        orderBy: { label: 'asc' },
        select: {
            id: true,
            label: true,
            emoji: true,
        },
    });

    return <EditProductForm product={product} categories={categories} />;
}
