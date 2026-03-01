'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

function parseIntField(formData: FormData, key: string, fallback: number) {
    const raw = Number(formData.get(key));
    if (!Number.isFinite(raw)) return fallback;
    return Math.max(0, Math.floor(raw));
}

export async function updateDeliveryPricing(formData: FormData) {
    const freeDeliveryThreshold = parseIntField(formData, 'freeDeliveryThreshold', 499);
    const reducedDeliveryThreshold = parseIntField(formData, 'reducedDeliveryThreshold', 299);
    const reducedDeliveryFee = parseIntField(formData, 'reducedDeliveryFee', 30);
    const baseDeliveryFee = parseIntField(formData, 'baseDeliveryFee', 50);

    if (reducedDeliveryThreshold > freeDeliveryThreshold) {
        return { error: 'Reduced-threshold cannot be greater than free-delivery threshold.' };
    }

    try {
        await (prisma as any).deliveryPricing.upsert({
            where: { id: 1 },
            update: {
                freeDeliveryThreshold,
                reducedDeliveryThreshold,
                reducedDeliveryFee,
                baseDeliveryFee,
            },
            create: {
                id: 1,
                freeDeliveryThreshold,
                reducedDeliveryThreshold,
                reducedDeliveryFee,
                baseDeliveryFee,
            },
        });

        revalidatePath('/admin/pricing');
        revalidatePath('/cart');
        revalidatePath('/checkout');

        return { success: true };
    } catch (error) {
        console.error('[updateDeliveryPricing]', error);
        return { error: 'Failed to update pricing settings.' };
    }
}
