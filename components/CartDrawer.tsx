'use client';

import Link from 'next/link';
import Image from 'next/image';
import { X, ShoppingBag, Trash2, ArrowRight, Tag, Loader2 } from 'lucide-react';
import { useEffect, useState, useTransition, useMemo, useRef } from 'react';
import clsx from 'clsx';
import { usePathname, useRouter } from 'next/navigation';

import { useCart } from '@/context/CartContext';
import QuantitySelector from '@/components/ui/QuantitySelector';
import Button from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

type NavPath = '/checkout' | '/cart';

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  const [isPending, startTransition] = useTransition();
  const [targetPath, setTargetPath] = useState<NavPath | null>(null);

  const {
    items,
    totalItems,
    totalPrice,
    cgstTotal,
    sgstTotal,
    deliveryConfig,
    deliveryCharge: delivery,
    updateQuantity,
    removeItem
  } = useCart();

  /* ---------------- DERIVED VALUES ---------------- */

  const grandTotal = useMemo(
    () => totalPrice + cgstTotal + sgstTotal + delivery,
    [totalPrice, cgstTotal, sgstTotal, delivery]
  );

  const amountForFreeDelivery = useMemo(
    () => Math.max(deliveryConfig.freeDeliveryThreshold - totalPrice, 0),
    [deliveryConfig.freeDeliveryThreshold, totalPrice]
  );

  /* ---------------- NAVIGATION ---------------- */

  const navigateFromDrawer = (path: NavPath) => {
    if (isPending || targetPath) return;

    setTargetPath(path);

    startTransition(() => {
      router.push(path);
    });
  };

  /* ---------------- NAVIGATION FAILSAFE ---------------- */

  useEffect(() => {
    if (!targetPath) return;

    const timer = setTimeout(() => {
      setTargetPath(null);
    }, 8000);

    return () => clearTimeout(timer);
  }, [targetPath]);

  /* ---------------- ROUTE CHANGE HANDSHAKE ---------------- */

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;

      if (isOpen) {
        onClose();
        setTargetPath(null);
      }
    }
  }, [pathname, isOpen, onClose]);

  /* ---------------- PREFETCH ---------------- */

  useEffect(() => {
    if (!isOpen) return;

    router.prefetch('/checkout');
    router.prefetch('/cart');
  }, [isOpen, router]);

  /* ---------------- SCROLL LOCK ---------------- */

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  /* ---------------- ESC KEY CLOSE ---------------- */

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };

    document.addEventListener('keydown', handler);

    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  return (
    <>
      {/* BACKDROP */}
      <div
        className={clsx(
          'fixed inset-0 z-50',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      >
        <div
          className={clsx(
            'absolute inset-0 transition-all duration-300 ease-out',
            isOpen
              ? 'opacity-100 bg-maroon-950/40 backdrop-blur-sm'
              : 'opacity-0 bg-transparent backdrop-blur-0'
          )}
        />
      </div>

      {/* DRAWER */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        className={clsx(
          'fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-cream-50 shadow-warm-lg',
          'flex flex-col transform-gpu transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-cream-200 bg-white">
          <div className="flex items-center gap-2.5">
            <ShoppingBag size={20} className="text-saffron-500" aria-hidden="true" />

            <h2 id="cart-drawer-title" className="font-display font-bold text-maroon-900 text-lg">
              Your Cart
            </h2>

            {totalItems > 0 && (
              <span className="px-2 py-0.5 bg-saffron-100 text-saffron-700 text-xs font-semibold rounded-full">
                {totalItems} item{totalItems !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            aria-label="Close cart"
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-cream-100 text-maroon-600 transition-colors"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* EMPTY CART */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="w-20 h-20 rounded-3xl bg-cream-100 flex items-center justify-center">
              <ShoppingBag size={36} className="text-cream-300" aria-hidden="true" />
            </div>

            <div>
              <p className="font-display font-semibold text-maroon-800 text-lg mb-1">
                Your cart is empty
              </p>

              <p className="text-sm text-maroon-400">
                Add some delicious mithai to get started!
              </p>
            </div>

            <Button
              asChild
              variant="primary"
              size="md"
              rightIcon={<ArrowRight size={16} />}
            >
              <Link href="/items" onClick={onClose}>
                Browse Sweets
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {/* ITEMS */}
            <ul className="flex-1 overflow-y-auto divide-y divide-cream-100 px-4 py-2">
              {items.map((item) => (
                <li key={item.id} className="flex items-start gap-3 py-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-cream-100 shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="64px"
                      loading="lazy"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-maroon-900 text-sm line-clamp-1">
                      {item.name}
                    </p>

                    <p className="text-xs text-maroon-400 mt-0.5">
                      {item.weightGrams}g / pack
                    </p>

                    <p className="text-sm font-bold text-maroon-900 mt-1.5">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <button
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.name} from cart`}
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

            {/* SUMMARY */}
            <div className="border-t border-cream-200 bg-white px-5 py-4 space-y-3">
              {delivery > 0 && amountForFreeDelivery > 0 && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-saffron-50 border border-saffron-100">
                  <Tag size={14} className="text-saffron-600 shrink-0" />
                  <p className="text-xs text-saffron-700">
                    Add <strong>{formatCurrency(amountForFreeDelivery)}</strong> more for FREE delivery!
                  </p>
                </div>
              )}

              <div className="space-y-1.5 text-sm">
                <Row label="Subtotal" value={formatCurrency(totalPrice)} />

                {(cgstTotal > 0 || sgstTotal > 0) && (
                  <>
                    <Row label="CGST" value={formatCurrency(cgstTotal)} />
                    <Row label="SGST" value={formatCurrency(sgstTotal)} />
                  </>
                )}

                <Row
                  label="Delivery"
                  value={delivery === 0 ? 'FREE' : formatCurrency(delivery)}
                  highlight={delivery === 0}
                />

                <div className="flex justify-between font-bold text-maroon-900 text-base pt-2 border-t border-cream-200">
                  <span>Total</span>
                  <span>{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              {/* BUTTONS */}
              <div className="flex flex-col gap-2 pt-1">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={Boolean(targetPath)}
                  rightIcon={!targetPath && <ArrowRight size={18} />}
                  onClick={() => navigateFromDrawer('/checkout')}
                >
                  {targetPath === '/checkout' ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Opening Checkout...
                    </span>
                  ) : (
                    'Proceed to Checkout'
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="md"
                  fullWidth
                  disabled={Boolean(targetPath)}
                  onClick={() => navigateFromDrawer('/cart')}
                >
                  {targetPath === '/cart' ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Opening Cart...
                    </span>
                  ) : (
                    'View Full Cart'
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

function Row({
  label,
  value,
  highlight = false
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between text-maroon-600">
      <span>{label}</span>
      <span className={highlight ? 'text-green-600 font-medium' : ''}>
        {value}
      </span>
    </div>
  );
}