import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, Clock, Phone, ArrowRight, ShoppingBag } from 'lucide-react';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
    title: 'Order Confirmed!',
    robots: { index: false, follow: false },
};

interface SuccessPageProps {
    searchParams: Promise<{ orderId?: string | string[] }>;
}

const ESTIMATED_HOURS = 6;

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
    const resolvedSearchParams = await searchParams;
    const orderIdParam = resolvedSearchParams.orderId;
    const orderId = Array.isArray(orderIdParam) ? orderIdParam[0] : (orderIdParam ?? 'N/A');
    const shortId = orderId.length > 8 ? `…${orderId.slice(-8)}` : orderId;

    const now = new Date();
    const deliveryTime = new Date(now.getTime() + ESTIMATED_HOURS * 60 * 60 * 1000);
    const deliveryStr = deliveryTime.toLocaleString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });

    return (
        <div className="min-h-screen bg-cream-100 flex items-center justify-center px-4 py-16">
            <div className="max-w-lg w-full">

                {/* ── Animated checkmark card ── */}
                <div className="card-base p-8 hover:!-translate-y-0 text-center mb-6">
                    {/* Success circle */}
                    <div className="relative mx-auto w-24 h-24 mb-6">
                        <span className="absolute inset-0 rounded-full border-4 border-green-100" />
                        <div className="relative w-24 h-24 rounded-full bg-green-500 flex items-center justify-center shadow-lg motion-safe:animate-pulse">
                            <CheckCircle2 size={44} className="text-white" strokeWidth={2} />
                        </div>
                    </div>

                    <h1 className="font-display font-bold text-3xl text-maroon-900 mb-2">
                        Order Confirmed!
                    </h1>
                    <p className="text-maroon-500 text-sm leading-relaxed mb-5">
                        Thanks for ordering with us. Your order is received and our team has started preparing it.
                    </p>

                    {/* Order ID chip */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-cream-100 rounded-2xl border border-cream-200">
                        <span className="text-xs text-maroon-400">Order ID</span>
                        <code className="text-xs font-mono font-bold text-maroon-800">{shortId}</code>
                    </div>
                </div>

                {/* ── Status tracker ── */}
                <div className="card-base p-5 hover:!-translate-y-0 mb-4">
                    <h2 className="font-display font-semibold text-maroon-800 text-base mb-4">What Happens Next?</h2>
                    <ol className="space-y-4">
                        {[
                            {
                                icon: CheckCircle2,
                                color: 'text-green-500',
                                bg: 'bg-green-50',
                                title: 'Payment Received',
                                desc: 'Your payment has been confirmed & secured.',
                                done: true,
                            },
                            {
                                icon: ShoppingBag,
                                color: 'text-saffron-500',
                                bg: 'bg-saffron-50',
                                title: 'Preparing Your Order',
                                desc: 'Our mithai masters are handcrafting your sweets fresh.',
                                done: false,
                            },
                            {
                                icon: Clock,
                                color: 'text-gold-500',
                                bg: 'bg-gold-50',
                                title: 'Out for Delivery',
                                desc: `Estimated delivery by ${deliveryStr}`,
                                done: false,
                            },
                        ].map(({ icon: Icon, color, bg, title, desc, done }) => (
                            <li key={title} className="flex items-start gap-3">
                                <span className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                                    <Icon size={16} className={color} />
                                </span>
                                <div>
                                    <p className={`text-sm font-semibold ${done ? 'text-green-700' : 'text-maroon-800'}`}>
                                        {title}
                                        {done && <span className="ml-2 text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium uppercase tracking-wide">Done</span>}
                                    </p>
                                    <p className="text-xs text-maroon-400 mt-0.5">{desc}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>

                {/* ── Help card ── */}
                <div className="card-base p-4 hover:!-translate-y-0 mb-6">
                    <p className="text-xs text-maroon-500 text-center mb-2">
                        Questions about your order?
                    </p>
                    <a
                        href="tel:+917055513961"
                        className="flex items-center justify-center gap-2 w-full py-2.5 border border-maroon-100 rounded-xl text-sm font-medium text-maroon-700 hover:bg-maroon-50 transition-colors"
                    >
                        <Phone size={15} />
                        Call Us: +91 70555 13961
                    </a>
                </div>

                {/* ── CTAs ── */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/orders" className="flex-1">
                        <Button
                            variant="outline"
                            size="lg"
                            fullWidth
                            rightIcon={<ArrowRight size={16} />}
                        >
                            View My Orders
                        </Button>
                    </Link>
                    <Link href="/items" className="flex-1">
                        <Button
                            variant="primary"
                            size="lg"
                            fullWidth
                            rightIcon={<ShoppingBag size={16} />}
                        >
                            Order More Sweets
                        </Button>
                    </Link>
                    <Link href="/" className="flex-1">
                        <Button
                            variant="outline"
                            size="lg"
                            fullWidth
                            rightIcon={<ArrowRight size={16} />}
                        >
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
