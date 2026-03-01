'use client';

import Link from 'next/link';
import Image from 'next/image';
import { X, ShoppingBag, Trash2, ArrowRight, Tag } from 'lucide-react';
import { useEffect } from 'react';
import clsx from 'clsx';
import { useCart } from '@/context/CartContext';
import QuantitySelector from '@/components/ui/QuantitySelector';
import Button from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { items, totalItems, totalPrice, cgstTotal, sgstTotal, deliveryConfig, deliveryCharge: delivery, updateQuantity, removeItem } = useCart();
    const grandTotal = totalPrice + cgstTotal + sgstTotal + delivery;

    // Lock scroll
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    return (
        <>
            {/* Backdrop */}
            <div
                className={clsx(
                    'fixed inset-0 z-50 bg-maroon-950/40 backdrop-blur-sm transition-opacity duration-300',
                    isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                )}
                onClick={onClose}
                aria-hidden
            />

            {/* Drawer panel */}
            <aside
                role="dialog"
                aria-modal
                aria-label="Shopping cart"
                className={clsx(
                    'fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-cream-50 shadow-warm-lg',
                    'flex flex-col transition-transform duration-300 ease-in-out',
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-cream-200 bg-white">
                    <div className="flex items-center gap-2.5">
                        <ShoppingBag size={20} className="text-saffron-500" />
                        <h2 className="font-display font-bold text-maroon-900 text-lg">Your Cart</h2>
                        {totalItems > 0 && (
                            <span className="px-2 py-0.5 bg-saffron-100 text-saffron-700 text-xs font-semibold rounded-full">
                                {totalItems} item{totalItems !== 1 ? 's' : ''}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Close cart"
                        className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-cream-100 text-maroon-600 transition-colors touch-target"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Items list */}
                {items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
                        <div className="w-20 h-20 rounded-3xl bg-cream-100 flex items-center justify-center">
                            <ShoppingBag size={36} className="text-cream-300" />
                        </div>
                        <div>
                            <p className="font-display font-semibold text-maroon-800 text-lg mb-1">Your cart is empty</p>
                            <p className="text-sm text-maroon-400">Add some delicious mithai to get started!</p>
                        </div>
                        <Button variant="primary" size="md" onClick={onClose} rightIcon={<ArrowRight size={16} />}>
                            <Link href="/items">Browse Sweets</Link>
                        </Button>
                    </div>
                ) : (
                    <>
                        <ul className="flex-1 overflow-y-auto divide-y divide-cream-100 px-4 py-2">
                            {items.map((item) => (
                                <li key={item.id} className="flex items-start gap-3 py-4">
                                    {/* Image */}
                                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-cream-100 shrink-0">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            sizes="64px"
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-maroon-900 text-sm leading-tight line-clamp-1">{item.name}</p>
                                        <p className="text-xs text-maroon-400 mt-0.5">{item.weightGrams}g / pack</p>
                                        <p className="text-sm font-bold text-maroon-900 mt-1.5">{formatCurrency(item.price * item.quantity)}</p>
                                    </div>

                                    {/* Controls */}
                                    <div className="flex flex-col items-end gap-2 shrink-0">
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            aria-label={`Remove ${item.name}`}
                                            className="w-7 h-7 flex items-center justify-center rounded-lg text-maroon-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                        <QuantitySelector
                                            size="sm"
                                            value={item.quantity}
                                            min={0}
                                            onChange={(v) => updateQuantity(item.id, v)}
                                        />
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {/* Order Summary */}
                        <div className="border-t border-cream-200 bg-white px-5 py-4 space-y-3">
                            {/* Free delivery banner */}
                            {delivery > 0 && (
                                <div className="flex items-center gap-2 p-3 rounded-xl bg-saffron-50 border border-saffron-100">
                                    <Tag size={14} className="text-saffron-600 shrink-0" />
                                    <p className="text-xs text-saffron-700">
                                        Add <strong>{formatCurrency(Math.max(deliveryConfig.freeDeliveryThreshold - totalPrice, 0))}</strong> more for FREE delivery!
                                    </p>
                                </div>
                            )}

                            <div className="space-y-1.5 text-sm">
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
                                    <span>Total</span>
                                    <span>{formatCurrency(grandTotal)}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 pt-1">
                                <Link href="/checkout" onClick={onClose} className="w-full">
                                    <Button variant="primary" size="lg" fullWidth rightIcon={<ArrowRight size={18} />}>
                                        Proceed to Checkout
                                    </Button>
                                </Link>
                                <Link href="/cart" onClick={onClose} className="w-full">
                                    <Button variant="ghost" size="md" fullWidth>
                                        View Full Cart
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </aside>
        </>
    );
}
