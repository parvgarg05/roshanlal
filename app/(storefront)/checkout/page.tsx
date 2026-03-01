import type { Metadata } from 'next';
import { ShoppingBag } from 'lucide-react';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import { formatOrderWindowIST, getOrderTimingConfig } from '@/lib/orderTiming';

export const metadata: Metadata = {
    title: 'Checkout',
    description: 'Complete your order of fresh Indian sweets from L.Roshanlal Ji Sweets.',
    robots: { index: false, follow: false }, // Don't index checkout pages
};

export default async function CheckoutPage() {
    const orderTiming = await getOrderTimingConfig();

    return (
        <div className="min-h-screen bg-cream-100">
            {/* Header */}
            <div className="bg-maroon-gradient py-6 sm:py-8 text-cream-50">
                <div className="section-container">
                    <p className="text-xs font-bold uppercase tracking-widest text-gold-300 mb-1">Secure Checkout</p>
                    <h1 className="font-display font-bold text-3xl flex items-center gap-3">
                        <ShoppingBag size={28} className="text-saffron-400" />
                        Complete Your Order
                    </h1>
                    <p className="text-cream-300 text-sm mt-1">
                        Your payment is secured by Razorpay — India&apos;s most trusted payment gateway
                    </p>
                    <p className="text-cream-200 text-xs mt-2">
                        Order timing: {formatOrderWindowIST(orderTiming)}
                    </p>
                </div>
            </div>

            {/* Form */}
            <div className="section-container py-6 sm:py-8">
                <CheckoutForm />
            </div>
        </div>
    );
}
