'use server';

import { revalidatePath } from 'next/cache';
import { setOrderTimingConfig } from '@/lib/orderTiming';

type TimingValues = {
    startHour: number;
    endHour: number;
};

function normalizeHour(value: number, fallback: number): number {
    if (!Number.isFinite(value)) return fallback;
    const hour = Math.floor(value);
    if (hour < 0) return 0;
    if (hour > 23) return 23;
    return hour;
}

function normalizeEndHour(value: number, fallback: number, startHour: number): number {
    if (!Number.isFinite(value)) return fallback;
    const hour = Math.floor(value);
    if (hour < 0) return 0;
    if (hour > 23) return 23;
    if (hour === 0 && startHour > 0) return 24;
    return hour;
}

export async function updateOrderTiming(values: TimingValues) {
    const startHour = normalizeHour(values.startHour, 9);
    const endHour = normalizeEndHour(values.endHour, 21, startHour);

    if (startHour === endHour) {
        return { error: 'Start time and end time cannot be the same.' };
    }

    try {
        await setOrderTimingConfig({ startHour, endHour });

        revalidatePath('/admin/timing');
        revalidatePath('/checkout');

        return { success: true };
    } catch (error) {
        console.error('[updateOrderTiming]', error);
        return { error: 'Failed to update order timing.' };
    }
}
