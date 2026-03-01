'use server';

import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { isHttpImageUrl } from '@/lib/utils';

export async function updateProduct(id: string, formData: FormData) {
    try {
        const existingProduct = await prisma.product.findUnique({
            where: { id },
            select: { id: true, image: true },
        });

        if (!existingProduct) {
            return { error: 'Product not found' };
        }

        const slug = (formData.get('slug') as string)?.trim();
        const allergensStr = (formData.get('allergens') as string)?.trim();
        const allergens = allergensStr ? allergensStr.split(',').map((s) => s.trim()).filter(Boolean) : [];

        const imageInput = (formData.get('image') as string)?.trim();
        const ingredientsInput = (formData.get('ingredients') as string)?.trim();

        if (imageInput && isHttpImageUrl(imageInput)) {
            return { error: 'Please use an HTTPS image URL. HTTP images are blocked on secure deployed sites.' };
        }

        await prisma.product.update({
            where: { id },
            data: {
                name: (formData.get('name') as string)?.trim(),
                nameHindi: (formData.get('nameHindi') as string)?.trim(),
                slug,
                description: (formData.get('description') as string)?.trim(),
                price: Number(formData.get('price')),
                categoryId: formData.get('categoryId') as string,
                image: imageInput || existingProduct.image,
                weightGrams: Number(formData.get('weightGrams')),
                shelfLifeDays: Number(formData.get('shelfLifeDays')),
                isVeg: formData.get('isVeg') === 'true',
                isAvailable: formData.get('isAvailable') === 'true',
                isFeatured: formData.get('isFeatured') === 'true',
                isTodaySpecial: formData.get('isTodaySpecial') === 'true',
                allergens,
                ingredients: ingredientsInput || null,
            },
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            return { error: 'Slug already exists. Please choose a unique slug.' };
        }

        console.error('[updateProduct]', error);
        return { error: 'Failed to update product' };
    }

    revalidatePath('/admin/products');
    revalidatePath('/');
    revalidatePath('/items');
    redirect('/admin/products');
}
