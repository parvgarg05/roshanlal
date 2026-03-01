'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';

export const dynamic = 'force-dynamic';

type TrackedOrder = {
    id: string;
    status: string;
    totalPaise: number;
    createdAt: string;
    items: Array<{
        id: string;
        name: string;
        price: number;
        quantity: number;
    }>;
};

export default function OrdersPage() {
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [orders, setOrders] = useState<TrackedOrder[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/orders/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, email }),
            });

            const data = await response.json();
            if (!response.ok) {
                setOrders([]);
                setHasSearched(true);
                setError(data?.error || 'Unable to fetch orders.');
                return;
            }

            setOrders(data.orders || []);
            setHasSearched(true);
        } catch {
            setOrders([]);
            setHasSearched(true);
            setError('Unable to fetch orders.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-cream-100">
            <div className="section-container py-8">
                <h1 className="font-display font-bold text-3xl text-maroon-900 mb-2">My Orders</h1>
                <p className="text-maroon-500 text-sm mb-6">Enter the phone number and email used during checkout.</p>

                <form onSubmit={onSubmit} className="card-base p-5 mb-6 hover:!-translate-y-0 space-y-4">
                    <Input
                        label="Phone Number"
                        type="tel"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => {
                            const digitsOnly = e.target.value.replace(/\D/g, '');
                            setPhone(digitsOnly.length > 10 ? digitsOnly.slice(-10) : digitsOnly);
                        }}
                        placeholder="9876543210"
                        required
                    />
                    <Input
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                    />

                    {error && (
                        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                            {error}
                        </p>
                    )}

                    <Button type="submit" variant="primary" size="lg" loading={loading}>
                        Find Orders
                    </Button>
                </form>

                {hasSearched && orders.length === 0 && !error && (
                    <div className="card-base p-6 text-center hover:!-translate-y-0">
                        <p className="text-maroon-700 font-medium">No orders found for these details.</p>
                    </div>
                )}

                {orders.length > 0 && (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="card-base p-5 hover:!-translate-y-0">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                                    <p className="text-sm text-maroon-500">
                                        Ordered on {new Date(order.createdAt).toLocaleString('en-IN')}
                                    </p>
                                    <span
                                        className={`text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded-full w-fit ${
                                            order.status.toLowerCase() === 'paid' || order.status.toLowerCase() === 'delivered'
                                                ? 'bg-green-100 text-green-700'
                                                : order.status.toLowerCase() === 'failed' || order.status.toLowerCase() === 'refunded'
                                                    ? 'bg-red-100 text-red-700'
                                                    : 'bg-cream-200 text-maroon-700'
                                        }`}
                                    >
                                        {order.status}
                                    </span>
                                </div>

                                <div className="space-y-2 mb-3">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between text-sm">
                                            <p className="text-maroon-800">
                                                {item.name} x {item.quantity}
                                            </p>
                                            <p className="text-maroon-700 font-medium">
                                                {formatCurrency(item.price * item.quantity)}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-3 border-t border-cream-200 flex items-center justify-between">
                                    <p className="text-sm text-maroon-500">Order ID: {order.id}</p>
                                    <p className="font-semibold text-maroon-900">
                                        {formatCurrency(order.totalPaise / 100)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
