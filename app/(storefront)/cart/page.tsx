'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Trash2, ShoppingBag, ArrowRight, Tag, ArrowLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import QuantitySelector from '@/components/ui/QuantitySelector';
import Button from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';

export default function CartPage() {
    const { items, totalPrice, deliveryConfig, deliveryCharge: delivery, updateQuantity, removeItem, clearCart } = useCart();
    const grandTotal = totalPrice + delivery;

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-cream-100 flex items-center justify-center">
                <div className="text-center px-6 py-16 max-w-sm">
                    <div className="w-24 h-24 mx-auto mb-5 rounded-3xl bg-cream-200 flex items-center justify-center">
                        <ShoppingBag size={44} className="text-maroon-300" />
                    </div>
                    <h1 className="font-display font-bold text-2xl text-maroon-900 mb-2">Your cart is empty</h1>
                    <p className="text-maroon-400 text-sm mb-7">Looks like you haven&apos;t added any sweets yet. Let&apos;s fix that!</p>
                    <Link href="/items">
                        <Button variant="primary" size="lg" leftIcon={<ArrowLeft size={16} />}>
                            Browse Mithai
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream-100">
            {/* Header */}
            <div className="bg-maroon-gradient py-8 text-cream-50">
                <div className="section-container">
                    <p className="text-xs font-bold uppercase tracking-widest text-gold-300 mb-1">Review Order</p>
                    <h1 className="font-display font-bold text-3xl">Your Cart</h1>
                </div>
            </div>

            <div className="section-container py-6 sm:py-8">
                <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 items-start">

                    {/* ── Cart Items ── */}
                    <div className="lg:col-span-2 space-y-3">
                        {/* Header row */}
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-maroon-500 font-medium">{items.length} item{items.length > 1 ? 's' : ''}</p>
                            <button
                                onClick={clearCart}
                                className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors"
                            >
                                Clear all
                            </button>
                        </div>

                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="card-base flex items-start sm:items-center gap-4 p-4 sm:p-5 hover:!-translate-y-0"
                            >
                                {/* Image */}
                                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-cream-100 shrink-0">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        sizes="96px"
                                        className="object-cover"
                                    />
                                </div>

                                {/* Details */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-display font-semibold text-maroon-900 text-base leading-tight mb-0.5 line-clamp-1">
                                        {item.name}
                                    </h3>
                                    <p className="text-xs text-maroon-400 mb-3">{item.weightGrams}g per pack</p>
                                    <div className="flex items-center justify-between gap-3 flex-wrap">
                                        <QuantitySelector
                                            value={item.quantity}
                                            min={0}
                                            onChange={(v) => updateQuantity(item.id, v)}
                                            size="sm"
                                        />
                                        <p className="font-bold text-maroon-900 text-base">
                                            {formatCurrency(item.price * item.quantity)}
                                        </p>
                                    </div>
                                </div>

                                {/* Remove */}
                                <button
                                    onClick={() => removeItem(item.id)}
                                    aria-label={`Remove ${item.name}`}
                                    className="shrink-0 w-8 h-8 flex items-center justify-center rounded-xl text-maroon-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        ))}

                        {/* Continue shopping */}
                        <Link href="/items" className="inline-flex items-center gap-2 text-sm text-saffron-600 hover:text-saffron-700 font-medium transition-colors mt-3">
                            <ArrowLeft size={15} />
                            Continue Shopping
                        </Link>
                    </div>

                    {/* ── Order Summary ── */}
                    <div className="lg:sticky lg:top-24">
                        <div className="card-base p-5 hover:!-translate-y-0">
                            <h2 className="font-display font-bold text-xl text-maroon-900 mb-5">Order Summary</h2>

                            {/* Upsell banner */}
                            {delivery > 0 && (
                                <div className="flex items-start gap-2 p-3 rounded-xl bg-saffron-50 border border-saffron-100 mb-4">
                                    <Tag size={14} className="text-saffron-600 shrink-0 mt-0.5" />
                                    <p className="text-xs text-saffron-700 leading-relaxed">
                                        Add{' '}
                                        <strong>{formatCurrency(Math.max(deliveryConfig.freeDeliveryThreshold - totalPrice, 0))}</strong>{' '}
                                        more for <strong>FREE delivery</strong>!
                                    </p>
                                </div>
                            )}

                            <div className="space-y-3 mb-4">
                                {items.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm text-maroon-600">
                                        <span className="line-clamp-1 flex-1 mr-3">{item.name} ×{item.quantity}</span>
                                        <span className="shrink-0">{formatCurrency(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-cream-200 pt-4 space-y-2.5 text-sm">
                                <div className="flex justify-between text-maroon-600">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(totalPrice)}</span>
                                </div>
                                <div className="flex justify-between text-maroon-600">
                                    <span>Delivery</span>
                                    <span className={delivery === 0 ? 'text-green-600 font-medium' : ''}>
                                        {delivery === 0 ? 'FREE' : formatCurrency(delivery)}
                                    </span>
                                </div>
                                <div className="flex justify-between font-bold text-maroon-900 text-lg pt-2 border-t border-cream-200">
                                    <span>Grand Total</span>
                                    <span>{formatCurrency(grandTotal)}</span>
                                </div>
                            </div>

                            <div className="mt-5 flex flex-col gap-2.5">
                                <Link href="/checkout" className="w-full">
                                    <Button variant="primary" size="lg" fullWidth rightIcon={<ArrowRight size={18} />}>
                                        Proceed to Checkout
                                    </Button>
                                </Link>
                                <p className="text-[11px] text-center text-maroon-400">
                                    Secured with Razorpay · Free cancellation within 30 min
                                </p>
                            </div>
                        </div>

                        {/* Delivery info card */}
                        <div className="card-base p-4 mt-3 hover:!-translate-y-0">
                            <p className="text-xs font-semibold text-maroon-700 mb-2">Delivery Information</p>
                            <ul className="text-xs text-maroon-500 space-y-1 leading-relaxed">
                                <li>• Free delivery on orders above {formatCurrency(deliveryConfig.freeDeliveryThreshold)}</li>
                                <li>• Same-day delivery for orders before 2 PM</li>
                                <li>• Delivered fresh in insulated packaging</li>
                                <li>• Call us for bulk/wedding orders</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
