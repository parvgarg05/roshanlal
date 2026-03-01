'use client';

import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { ShieldCheck, CreditCard, Lock, Truck, AlertCircle } from 'lucide-react';
import {
    CheckoutFormSchema,
    type CheckoutFormValues,
} from '@/lib/validations/checkout';
import { useCart } from '@/context/CartContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';

/* ─── Razorpay types (CDN script – no @types/razorpay needed) ── */
declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
    }
}
interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    prefill: { name: string; email: string; contact: string };
    theme: { color: string };
    modal: { backdropclose: boolean; ondismiss?: () => void };
    handler: (response: RazorpayResponse) => void;
}
interface RazorpayResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}
interface RazorpayInstance {
    open(): void;
    on(event: string, cb: () => void): void;
}

/* ─── Helper: load Razorpay script ──────────────────────────── */
function loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
        if (document.getElementById('razorpay-cdn')) return resolve(true);
        const script = document.createElement('script');
        script.id = 'razorpay-cdn';
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}

async function markOrderAsFailed(internalOrderId: string): Promise<void> {
    try {
        await fetch('/api/checkout/cancel-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ internalOrderId }),
        });
    } catch {
        // Ignore network issues here; this is a best-effort cleanup call.
    }
}

/* ─── FormField helper ───────────────────────────────────────── */
function FormField({
    label, error, children, required,
}: {
    label: string; error?: string; children: React.ReactNode; required?: boolean;
}) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-maroon-800">
                {label}
                {required && <span className="text-saffron-500 ml-0.5">*</span>}
            </label>
            {children}
            {error && (
                <p className="text-xs text-red-500 flex items-center gap-1" role="alert">
                    <AlertCircle size={11} /> {error}
                </p>
            )}
        </div>
    );
}

/* ─── MAIN COMPONENT ─────────────────────────────────────────── */
export default function CheckoutForm() {
    const router = useRouter();
    const { items, totalPrice, cgstTotal, sgstTotal, deliveryConfig, deliveryCharge: delivery, clearCart } = useCart();
    const grandTotal = totalPrice + cgstTotal + sgstTotal + delivery;

    const [apiError, setApiError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFinalizingPayment, setIsFinalizingPayment] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CheckoutFormValues>({
        resolver: zodResolver(CheckoutFormSchema),
        mode: 'onTouched',
    });

    useEffect(() => {
        router.prefetch('/success');
        router.prefetch('/orders');
    }, [router]);

    const onSubmit = useCallback(async (data: CheckoutFormValues) => {
        setApiError(null);
        setIsLoading(true);

        try {
            // Step 1: Create Razorpay order on our server
            const orderRes = await fetch('/api/checkout/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer: data,
                    items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
                }),
            });

            if (!orderRes.ok) {
                const err = await orderRes.json();
                throw new Error(err.error ?? 'Failed to create order. Please try again.');
            }

            const orderData = await orderRes.json() as {
                razorpayOrderId: string;
                amount: number;
                currency: string;
                keyId: string;
                internalOrderId: string;
            };

            // Step 2: Load Razorpay script
            const loaded = await loadRazorpayScript();
            if (!loaded) throw new Error('Could not load payment gateway. Check your internet connection.');

            // Step 3: Open Razorpay widget
            await new Promise<void>((resolve, reject) => {
                const rzp = new window.Razorpay({
                    key: orderData.keyId,
                    amount: orderData.amount,
                    currency: orderData.currency,
                    name: 'Roshanlal & Sons',
                    description: 'Premium Indian Sweets Order',
                    order_id: orderData.razorpayOrderId,
                    prefill: {
                        name: data.name,
                        email: data.email,
                        contact: data.phone,
                    },
                    theme: { color: '#f97316' },   // saffron
                    modal: {
                        backdropclose: false,
                        ondismiss: () => {
                            setIsFinalizingPayment(false);
                            void markOrderAsFailed(orderData.internalOrderId);
                            reject(new Error('Payment cancelled by user.'));
                        },
                    },
                    handler: async (response: RazorpayResponse) => {
                        try {
                            setIsFinalizingPayment(true);

                            // Step 4: Verify signature on our server
                            const verifyRes = await fetch('/api/checkout/verify', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    razorpayOrderId: response.razorpay_order_id,
                                    razorpayPaymentId: response.razorpay_payment_id,
                                    razorpaySignature: response.razorpay_signature,
                                    internalOrderId: orderData.internalOrderId,
                                }),
                            });

                            if (!verifyRes.ok) {
                                const errData = await verifyRes.json();
                                setIsFinalizingPayment(false);
                                reject(new Error(errData.error ?? 'Payment verification failed.'));
                                return;
                            }

                            const verifyData = await verifyRes.json() as { orderId: string };

                            // Step 5: Clear cart and redirect
                            clearCart();
                            router.replace(`/success?orderId=${verifyData.orderId}`);
                            resolve();
                        } catch (e) {
                            setIsFinalizingPayment(false);
                            reject(e);
                        }
                    },
                });

                rzp.on('payment.failed', () => {
                    setIsFinalizingPayment(false);
                    void markOrderAsFailed(orderData.internalOrderId);
                    reject(new Error('Payment was declined. Please try a different payment method.'));
                });
                rzp.open();
            });
        } catch (err) {
            setIsFinalizingPayment(false);
            setApiError(err instanceof Error ? err.message : 'Something went wrong.');
        } finally {
            setIsLoading(false);
        }
    }, [items, clearCart, router]);

    return (
        <div className="grid lg:grid-cols-5 gap-5 sm:gap-6 lg:gap-10">

            {/* ── Left: Form ── */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="lg:col-span-3 space-y-5 sm:space-y-6"
            >
                {/* Personal Details */}
                <div className="card-base p-4 sm:p-5 hover:!-translate-y-0 space-y-4">
                    <h2 className="font-display font-bold text-maroon-900 text-lg flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-saffron-gradient text-white text-xs flex items-center justify-center font-bold">1</span>
                        Personal Details
                    </h2>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <FormField label="Full Name" error={errors.name?.message} required>
                            <Input
                                {...register('name')}
                                placeholder="e.g. Ramesh Kumar"
                                error={errors.name?.message}
                                autoComplete="name"
                            />
                        </FormField>
                        <FormField label="Mobile Number" error={errors.phone?.message} required>
                            <Input
                                {...register('phone')}
                                type="tel"
                                placeholder="e.g. 9876543210"
                                error={errors.phone?.message}
                                autoComplete="tel"
                                maxLength={10}
                            />
                        </FormField>
                    </div>

                    <FormField label="Email Address" error={errors.email?.message} required>
                        <Input
                            {...register('email')}
                            type="email"
                            placeholder="e.g. ramesh@example.com"
                            error={errors.email?.message}
                            autoComplete="email"
                        />
                    </FormField>
                </div>

                {/* Delivery Address */}
                <div className="card-base p-4 sm:p-5 hover:!-translate-y-0 space-y-4">
                    <h2 className="font-display font-bold text-maroon-900 text-lg flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-saffron-gradient text-white text-xs flex items-center justify-center font-bold">2</span>
                        Delivery Address
                    </h2>

                    <FormField label="Address Line" error={errors.addressLine?.message} required>
                        <Input
                            {...register('addressLine')}
                            placeholder="House / Block / Street"
                            error={errors.addressLine?.message}
                            autoComplete="address-line1"
                        />
                    </FormField>

                    <div className="grid sm:grid-cols-3 gap-4">
                        <FormField label="City" error={errors.city?.message} required>
                            <Input
                                {...register('city')}
                                placeholder="e.g. Kasganj"
                                error={errors.city?.message}
                                autoComplete="address-level2"
                            />
                        </FormField>
                        <FormField label="State" error={errors.state?.message} required>
                            <Input
                                {...register('state')}
                                placeholder="e.g. Uttar Pradesh"
                                error={errors.state?.message}
                                autoComplete="address-level1"
                            />
                        </FormField>
                        <FormField label="Pincode" error={errors.pincode?.message} required>
                            <Input
                                {...register('pincode')}
                                placeholder="6-digit PIN"
                                error={errors.pincode?.message}
                                autoComplete="postal-code"
                                maxLength={6}
                            />
                        </FormField>
                    </div>
                </div>

                {/* API error */}
                {apiError && (
                    <div className="rounded-2xl bg-red-50 border border-red-200 p-4 flex items-start gap-3 text-sm text-red-700">
                        <AlertCircle size={18} className="shrink-0 mt-0.5" />
                        {apiError}
                    </div>
                )}

                {/* Submit */}
                <Button
                    type="submit"
                    variant="primary"
                    size="xl"
                    fullWidth
                    loading={isLoading || isFinalizingPayment}
                    leftIcon={<Lock size={18} />}
                    disabled={items.length === 0 || isFinalizingPayment}
                >
                    {isFinalizingPayment
                        ? 'Finalizing payment…'
                        : isLoading
                            ? 'Processing…'
                            : `Pay ${formatCurrency(grandTotal)} Securely`}
                </Button>

                {/* Trust row */}
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs text-maroon-400">
                    <span className="flex items-center gap-1"><ShieldCheck size={13} className="text-green-500" /> 100% Secure</span>
                    <span className="flex items-center gap-1"><CreditCard size={13} className="text-saffron-500" /> Razorpay Powered</span>
                    <span className="flex items-center gap-1"><Truck size={13} className="text-maroon-400" /> Same-day Delivery</span>
                </div>
            </form>

            {/* ── Right: Order Summary ── */}
            <aside className="lg:col-span-2">
                <div className="card-base p-4 sm:p-5 hover:!-translate-y-0 lg:sticky lg:top-24">
                    <h2 className="font-display font-bold text-maroon-900 text-lg mb-4">Order Summary</h2>

                    {/* Items */}
                    <ul className="space-y-3 mb-4 max-h-64 overflow-y-auto no-scrollbar">
                        {items.map((item) => (
                            <li key={item.id} className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-cream-100 shrink-0 overflow-hidden relative">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-maroon-900 line-clamp-1">{item.name}</p>
                                    <p className="text-xs text-maroon-400">×{item.quantity}</p>
                                </div>
                                <span className="text-sm font-semibold text-maroon-900 shrink-0">
                                    {formatCurrency(item.price * item.quantity)}
                                </span>
                            </li>
                        ))}
                    </ul>

                    {/* Pricing */}
                    <div className="border-t border-cream-200 pt-4 space-y-2 text-sm">
                        <div className="flex justify-between text-maroon-600">
                            <span>Subtotal</span>
                            <span>{formatCurrency(totalPrice)}</span>
                        </div>
                        {(cgstTotal > 0 || sgstTotal > 0) && (
                            <>
                                <div className="flex justify-between text-maroon-600">
                                    <span>CGST</span>
                                    <span>{formatCurrency(cgstTotal)}</span>
                                </div>
                                <div className="flex justify-between text-maroon-600">
                                    <span>SGST</span>
                                    <span>{formatCurrency(sgstTotal)}</span>
                                </div>
                            </>
                        )}
                        <div className="flex justify-between text-maroon-600">
                            <span>Delivery</span>
                            <span className={delivery === 0 ? 'text-green-600 font-medium' : ''}>
                                {delivery === 0 ? 'FREE' : formatCurrency(delivery)}
                            </span>
                        </div>
                        <div className="flex justify-between font-bold text-maroon-900 text-base pt-2 border-t border-cream-200">
                            <span>Grand Total</span>
                            <span>{formatCurrency(grandTotal)}</span>
                        </div>
                    </div>

                    {/* Delivery note */}
                    <div className="mt-4 p-3 rounded-xl bg-gold-50 border border-gold-100 text-xs text-maroon-600 space-y-1">
                        <p className="font-semibold text-gold-700">Delivery Info</p>
                        <p>• Free delivery on orders above {formatCurrency(deliveryConfig.freeDeliveryThreshold)}</p>
                        <p>• Same-day delivery for orders before 2 PM</p>
                        <p>• Packed fresh in insulated packaging</p>
                    </div>
                </div>
            </aside>
        </div>
    );
}
