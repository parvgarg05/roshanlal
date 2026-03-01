import { z } from 'zod';

// ─── Payment Verification Schema ───────────────────────────────
// Used on the POST /api/checkout/verify route
export const PaymentVerifySchema = z.object({
    razorpayOrderId: z.string().startsWith('order_', 'Invalid Razorpay order ID'),
    razorpayPaymentId: z.string().startsWith('pay_', 'Invalid Razorpay payment ID'),
    razorpaySignature: z.string().min(64, 'Invalid signature length'),
    internalOrderId: z.string().min(1, 'Internal order ID required'),
});

export type PaymentVerifyRequest = z.infer<typeof PaymentVerifySchema>;
