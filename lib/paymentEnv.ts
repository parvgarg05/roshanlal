type PaymentEnvValidation = {
    ok: boolean;
    missing: string[];
    publishableKeyId: string | null;
    secretPresent: boolean;
};

export function validatePaymentEnv(): PaymentEnvValidation {
    const publishableKeyId =
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || null;
    const secretPresent = Boolean(process.env.RAZORPAY_KEY_SECRET);

    const missing: string[] = [];

    if (!publishableKeyId) {
        missing.push('NEXT_PUBLIC_RAZORPAY_KEY_ID (or RAZORPAY_KEY_ID)');
    }

    if (!secretPresent) {
        missing.push('RAZORPAY_KEY_SECRET');
    }

    return {
        ok: missing.length === 0,
        missing,
        publishableKeyId,
        secretPresent,
    };
}
