'use client';

import { CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function CartToast() {
    const { cartToastMessage, clearCartToast } = useCart();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const onMobileMenuStateChange = (event: Event) => {
            const customEvent = event as CustomEvent<{ isOpen?: boolean }>;
            setIsMobileMenuOpen(Boolean(customEvent.detail?.isOpen));
        };

        window.addEventListener('mobile-menu-state-change', onMobileMenuStateChange as EventListener);

        return () => {
            window.removeEventListener('mobile-menu-state-change', onMobileMenuStateChange as EventListener);
        };
    }, []);

    const shouldShowToast = Boolean(cartToastMessage) && !isMobileMenuOpen;

    return (
        <div className="fixed bottom-24 right-4 z-[70] pointer-events-none">
            <div
                role="status"
                aria-live="polite"
                className={clsx(
                    'inline-flex items-center gap-2.5 rounded-xl border border-saffron-300 bg-saffron-100 px-5 py-3 shadow-warm-md transition-all duration-300',
                    shouldShowToast
                        ? 'opacity-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 translate-y-2 pointer-events-none'
                )}
            >
                <CheckCircle2 size={18} className="text-saffron-700 shrink-0" />
                <span className="text-base font-medium text-maroon-900">
                    {cartToastMessage ?? 'Added to cart'}
                </span>
                {cartToastMessage && (
                    <button
                        type="button"
                        onClick={clearCartToast}
                        aria-label="Close notification"
                        className="ml-1 text-xs text-maroon-400 hover:text-maroon-700 transition-colors"
                    >
                        ✕
                    </button>
                )}
            </div>
        </div>
    );
}
