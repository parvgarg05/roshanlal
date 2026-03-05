'use client';

import React, { createContext, useContext, useState, useEffect, useOptimistic, useTransition } from 'react';
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

type CartAction =
    | { type: 'add'; item: Omit<CartItem, 'quantity'> }
    | { type: 'remove'; id: string }
    | { type: 'update-quantity'; id: string; quantity: number }
    | { type: 'clear' };

function reduceCartItems(state: CartItem[], action: CartAction): CartItem[] {
    switch (action.type) {
        case 'add': {
            const existing = state.find((i) => i.id === action.item.id);
            if (existing) {
                return state.map((i) =>
                    i.id === action.item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...state, { ...action.item, quantity: 1 }];
        }
        case 'remove':
            return state.filter((i) => i.id !== action.id);
        case 'update-quantity': {
            if (action.quantity <= 0) {
                return state.filter((i) => i.id !== action.id);
            }
            return state.map((i) =>
                i.id === action.id ? { ...i, quantity: action.quantity } : i
            );
        }
        case 'clear':
            return [];
        default:
            return state;
    }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [, startTransition] = useTransition();
    const [optimisticItems, applyOptimistic] = useOptimistic(items, reduceCartItems);
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

    const dispatchCartAction = (action: CartAction) => {
        applyOptimistic(action);
        startTransition(() => {
            setItems((prev) => reduceCartItems(prev, action));
        });
    };

    useEffect(() => {
        let isMounted = true;

        const loadDeliveryConfig = async () => {
            try {
                const res = await fetch('/api/config/delivery');
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
        dispatchCartAction({ type: 'add', item: product });
        setCartToastMessage('Added to cart');
    };

    useEffect(() => {
        if (!cartToastMessage) return;
        const timer = setTimeout(() => setCartToastMessage(null), 2200);
        return () => clearTimeout(timer);
    }, [cartToastMessage]);

    const removeItem = (id: string) =>
        dispatchCartAction({ type: 'remove', id });

    const updateQuantity = (id: string, quantity: number) => {
        dispatchCartAction({ type: 'update-quantity', id, quantity });
    };

    const clearCart = () => dispatchCartAction({ type: 'clear' });

    const totalItems = optimisticItems.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = optimisticItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const hasFreeDeliveryEligibleItem = optimisticItems.some((i) => i.isFreeDeliveryEligible);
    const deliveryCharge = calculateDeliveryCharge(totalPrice, hasFreeDeliveryEligibleItem, deliveryConfig);

    // Derived GST State
    const { cgstTotal, sgstTotal } = optimisticItems.reduce((acc, i) => {
        const itemGst = (i.price * i.quantity * (i.gstRate || 5)) / 100;
        const halfGst = itemGst / 2;
        return {
            cgstTotal: acc.cgstTotal + halfGst,
            sgstTotal: acc.sgstTotal + halfGst
        };
    }, { cgstTotal: 0, sgstTotal: 0 });

    return (
        <CartContext.Provider
            value={{ items: optimisticItems, totalItems, totalPrice, cgstTotal, sgstTotal, hasFreeDeliveryEligibleItem, deliveryConfig, deliveryCharge, addItem, removeItem, updateQuantity, clearCart, cartToastMessage, clearCartToast: () => setCartToastMessage(null) }}
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
