import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { PaymentVerifySchema } from '@/lib/validations/payment';
import { prisma } from '@/lib/prisma';
import { sendOrderConfirmationFanOut } from '@/lib/notifications';
import { validatePaymentEnv } from '@/lib/paymentEnv';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    try {
        // 1. Parse & validate
        const body = await req.json();
        const parsed = PaymentVerifySchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Invalid payload', details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const {
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
            internalOrderId,
        } = parsed.data;

        // 2. Reconstruct expected HMAC-SHA256 signature
        //    Razorpay spec: HMAC_SHA256(orderId + "|" + paymentId, key_secret)
        const paymentEnv = validatePaymentEnv();
        if (!paymentEnv.secretPresent) {
            return NextResponse.json(
                {
                    error: 'Server misconfiguration: missing payment environment variables.',
                    missing: paymentEnv.missing,
                },
                { status: 500 }
            );
        }

        const keySecret = process.env.RAZORPAY_KEY_SECRET as string;

        const expectedSignature = crypto
            .createHmac('sha256', keySecret)
            .update(`${razorpayOrderId}|${razorpayPaymentId}`)
            .digest('hex');

        // 3. Timing-safe comparison (prevents timing attacks)
        const sigBuffer = Buffer.from(razorpaySignature, 'hex');
        const expectedBuffer = Buffer.from(expectedSignature, 'hex');

        const isValid =
            sigBuffer.length === expectedBuffer.length &&
            crypto.timingSafeEqual(sigBuffer, expectedBuffer);

        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid payment signature. Payment verification failed.' },
                { status: 400 }
            );
        }

        const existingOrder = await prisma.order.findUnique({
            where: { id: internalOrderId },
            select: {
                id: true,
                razorpayOrderId: true,
                razorpayPaymentId: true,
                status: true,
                customer: { select: { name: true, email: true, phone: true } },
            },
        });

        if (!existingOrder) {
            return NextResponse.json(
                { error: 'Order not found for verification.' },
                { status: 404 }
            );
        }

        if (existingOrder.razorpayOrderId !== razorpayOrderId) {
            return NextResponse.json(
                { error: 'Order mismatch during verification.' },
                { status: 400 }
            );
        }

        if (existingOrder.status === 'PAID') {
            return NextResponse.json({
                success: true,
                orderId: existingOrder.id,
                status: existingOrder.status,
                customer: existingOrder.customer,
            });
        }

        // 4. Mark order as PAID in database
        const updatedOrder = await prisma.order.update({
            where: { id: internalOrderId },
            data: {
                status: 'PAID',
                razorpayPaymentId,
            },
            select: {
                id: true,
                razorpayOrderId: true,
                razorpayPaymentId: true,
                status: true,
                totalPaise: true,
                customer: { select: { name: true, email: true, phone: true } },
            },
        });

        // 5. Fire and forget notifications!
        // We intentionally DO NOT await this. It runs in the background.
        sendOrderConfirmationFanOut(updatedOrder.id).catch(console.error);

        // 6. Return success immediately
        return NextResponse.json({
            success: true,
            orderId: updatedOrder.id,
            status: updatedOrder.status,
            customer: updatedOrder.customer,
        });
    } catch (err) {
        console.error('[verify-payment]', err);
        const message = err instanceof Error ? err.message : 'Internal server error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
