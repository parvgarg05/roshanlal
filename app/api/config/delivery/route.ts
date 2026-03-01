import { NextResponse } from 'next/server';
import { getDeliveryPricingConfig } from '@/lib/delivery';

export const dynamic = 'force-dynamic';

export async function GET() {
    const config = await getDeliveryPricingConfig();
    return NextResponse.json(config);
}