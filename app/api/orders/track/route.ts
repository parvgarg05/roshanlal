import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TrackOrdersSchema } from '@/lib/validations/order-tracking';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parsed = TrackOrdersSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Invalid request', details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const { phone, email } = parsed.data;

        const orders = await prisma.order.findMany({
            where: {
                customer: {
                    is: {
                        phone,
                        email,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: 30,
            include: {
                items: true,
            },
        });

        return NextResponse.json({ orders });
    } catch (error) {
        console.error('[orders-track]', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
