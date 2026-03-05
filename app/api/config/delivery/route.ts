import { NextResponse } from 'next/server';
import { getDeliveryPricingConfig } from '@/lib/delivery';

export const revalidate = 300;

export async function GET() {
    const config = await getDeliveryPricingConfig();
    return NextResponse.json(config);
}
