'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    DEFAULT_DELIVERY_PRICING,
    calculateDeliveryCharge,
    type DeliveryPricingConfig,
} from '@/lib/delivery';

/* ─── Types ─────────────────────────────────────────────── */
export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    weightGrams: number;
    gstRate: number;
    isFreeDeliveryEligible?: boolean;
}

interface CartContextValue {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
    cgstTotal: number;
    sgstTotal: number;
    hasFreeDeliveryEligibleItem: boolean;
    deliveryConfig: DeliveryPricingConfig;
    deliveryCharge: number;
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    cartToastMessage: string | null;
    clearCartToast: () => void;
}

/* ─── Context ───────────────────────────────────────────── */
const CartContext = createContext<CartContextValue | null>(null);

const CART_STORAGE_KEY = 'rl_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [deliveryConfig, setDeliveryConfig] = useState<DeliveryPricingConfig>(DEFAULT_DELIVERY_PRICING);
    const [cartToastMessage, setCartToastMessage] = useState<string | null>(null);

    // Hydrate from localStorage on mount
    useEffect(() => {
        try {
            const raw = localStorage.getItem(CART_STORAGE_KEY);
            if (raw) setItems(JSON.parse(raw) as CartItem[]);
        } catch {
            // ignore
        }
    }, []);

    // Persist to localStorage on change
    useEffect(() => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    useEffect(() => {
        let isMounted = true;

        const loadDeliveryConfig = async () => {
            try {
                const res = await fetch('/api/config/delivery', { cache: 'no-store' });
                if (!res.ok) return;

                const config = await res.json() as DeliveryPricingConfig;
                if (isMounted) {
                    setDeliveryConfig(config);
                }
            } catch {
                // Ignore and keep defaults
            }
        };

        loadDeliveryConfig();

        return () => {
            isMounted = false;
        };
    }, []);

    const addItem = (product: Omit<CartItem, 'quantity'>) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.id === product.id);
            if (existing) {
                return prev.map((i) =>
                    i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        setCartToastMessage('Added to cart');
    };

    useEffect(() => {
        if (!cartToastMessage) return;
        const timer = setTimeout(() => setCartToastMessage(null), 2200);
        return () => clearTimeout(timer);
    }, [cartToastMessage]);

    const removeItem = (id: string) =>
        setItems((prev) => prev.filter((i) => i.id !== id));

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity <= 0) return removeItem(id);
        setItems((prev) =>
            prev.map((i) => (i.id === id ? { ...i, quantity } : i))
        );
    };

    const clearCart = () => setItems([]);

    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const hasFreeDeliveryEligibleItem = items.some((i) => i.isFreeDeliveryEligible);
    const deliveryCharge = calculateDeliveryCharge(totalPrice, hasFreeDeliveryEligibleItem, deliveryConfig);

    // Derived GST State
    const { cgstTotal, sgstTotal } = items.reduce((acc, i) => {
        const itemGst = (i.price * i.quantity * (i.gstRate || 5)) / 100;
        const halfGst = itemGst / 2;
        return {
            cgstTotal: acc.cgstTotal + halfGst,
            sgstTotal: acc.sgstTotal + halfGst
        };
    }, { cgstTotal: 0, sgstTotal: 0 });

    return (
        <CartContext.Provider
            value={{ items, totalItems, totalPrice, cgstTotal, sgstTotal, hasFreeDeliveryEligibleItem, deliveryConfig, deliveryCharge, addItem, removeItem, updateQuantity, clearCart, cartToastMessage, clearCartToast: () => setCartToastMessage(null) }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart(): CartContextValue {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
}
