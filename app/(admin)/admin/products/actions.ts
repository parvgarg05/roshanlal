'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { CACHE_TAGS } from '@/lib/cache-tags';

export async function toggleProductStatus(id: string, field: 'isAvailable' | 'isFeatured' | 'isTodaySpecial', currentValue: boolean) {
    try {
        await prisma.product.update({
            where: { id },
            data: { [field]: !currentValue },
        });

        // Revalidate the frontend so the storefront updates instantly
        revalidatePath('/admin/products');
        revalidatePath('/');
        revalidatePath('/items');
        revalidateTag(CACHE_TAGS.products);
        revalidateTag(CACHE_TAGS.featuredProducts);
        revalidateTag(CACHE_TAGS.todaySpecials);

        return { success: true };
    } catch (error) {
        console.error('[toggleProductStatus]', error);
        return { error: 'Failed to update product' };
    }
}

export async function deleteProduct(id: string) {
    try {
        await prisma.product.delete({
            where: { id },
        });

        revalidatePath('/admin/products');
        revalidatePath('/');
        revalidatePath('/items');
        revalidateTag(CACHE_TAGS.products);
        revalidateTag(CACHE_TAGS.featuredProducts);
        revalidateTag(CACHE_TAGS.todaySpecials);

        return { success: true };
    } catch (error) {
        console.error('[deleteProduct]', error);
        return { error: 'Failed to delete product' };
    }
}
