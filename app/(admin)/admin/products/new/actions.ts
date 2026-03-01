'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { isHttpImageUrl } from '@/lib/utils';

export async function createProduct(formData: FormData) {
    try {
        const slug = formData.get('slug') as string;
        const imageInput = (formData.get('image') as string)?.trim();

        if (imageInput && isHttpImageUrl(imageInput)) {
            return { error: 'Please use an HTTPS image URL. HTTP images are blocked on secure deployed sites.' };
        }

        // Convert form string to array of allergens
        const allergensStr = formData.get('allergens') as string;
        const allergens = allergensStr ? allergensStr.split(',').map((s) => s.trim()) : [];

        await prisma.product.create({
            data: {
                name: formData.get('name') as string,
                nameHindi: formData.get('nameHindi') as string,
                slug: slug,
                description: formData.get('description') as string,
                price: Number(formData.get('price')),
                categoryId: formData.get('categoryId') as string,
                image: imageInput || 'https://images.unsplash.com/photo-1666819135879-f2e5ff80f9f6?w=600&auto=format&fit=crop', // default image

                weightGrams: Number(formData.get('weightGrams')),
                shelfLifeDays: Number(formData.get('shelfLifeDays')),

                isVeg: formData.get('isVeg') === 'true',
                isAvailable: formData.get('isAvailable') === 'true',
                isFeatured: formData.get('isFeatured') === 'true',
                isTodaySpecial: formData.get('isTodaySpecial') === 'true',

                allergens,
                ingredients: formData.get('ingredients') as string || null,
            },
        });

    } catch (error) {
        console.error('[createProduct]', error);
        return { error: 'Failed to create product' };
    }

    revalidatePath('/admin/products');
    revalidatePath('/');
    revalidatePath('/items');
    redirect('/admin/products');
}
