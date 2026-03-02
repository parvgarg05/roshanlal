import Razorpay from 'razorpay';

// Singleton Razorpay instance (server-only)
let razorpayInstance: Razorpay | null = null;

export function getRazorpay(): Razorpay {
    if (!razorpayInstance) {
        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        if (!keyId || !keySecret) {
            throw new Error(
                'Missing Razorpay credentials. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment variables.'
            );
        }

        razorpayInstance = new Razorpay({ key_id: keyId, key_secret: keySecret });
    }
    return razorpayInstance;
}
