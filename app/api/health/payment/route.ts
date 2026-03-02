import { NextResponse } from 'next/server';
import { validatePaymentEnv } from '@/lib/paymentEnv';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
    const paymentEnv = validatePaymentEnv();

    const payload = {
        ok: paymentEnv.ok,
        service: 'payment',
        checks: {
            razorpayKeyIdPresent: Boolean(paymentEnv.publishableKeyId),
            razorpaySecretPresent: paymentEnv.secretPresent,
        },
        missing: paymentEnv.missing,
        timestamp: new Date().toISOString(),
    };

    if (!paymentEnv.ok) {
        return NextResponse.json(payload, { status: 503 });
    }

    return NextResponse.json(payload, { status: 200 });
}
