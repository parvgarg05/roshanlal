import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { CATEGORIES } from '@/lib/products';
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

    const categories = CATEGORIES.filter((category) => category.id !== 'all').map((category) => ({
        id: category.id,
        label: category.label,
        emoji: category.emoji,
    }));

    return <EditProductForm product={product} categories={categories} />;
}
