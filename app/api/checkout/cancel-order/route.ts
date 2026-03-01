import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const CancelOrderSchema = z.object({
    internalOrderId: z.string().min(1, 'Internal order ID required'),
});

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parsed = CancelOrderSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Invalid payload', details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const { internalOrderId } = parsed.data;

        await prisma.order.updateMany({
            where: {
                id: internalOrderId,
                status: 'PENDING',
                razorpayPaymentId: null,
            },
            data: {
                status: 'FAILED',
            },
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('[cancel-order]', err);
        const message = err instanceof Error ? err.message : 'Internal server error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
