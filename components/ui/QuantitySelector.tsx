'use client';

import { Minus, Plus } from 'lucide-react';
import clsx from 'clsx';
import { clamp } from '@/lib/utils';

interface QuantitySelectorProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    size?: 'sm' | 'md';
    className?: string;
}

export default function QuantitySelector({
    value,
    onChange,
    min = 1,
    max = 99,
    size = 'md',
    className,
}: QuantitySelectorProps) {
    const isSm = size === 'sm';

    const decrement = () => onChange(clamp(value - 1, min, max));
    const increment = () => onChange(clamp(value + 1, min, max));

    return (
        <div
            className={clsx(
                'inline-flex items-center rounded-xl border border-cream-200 bg-white shadow-warm-sm overflow-hidden',
                className
            )}
            role="group"
            aria-label="Quantity selector"
        >
            <button
                onClick={decrement}
                disabled={value <= min}
                aria-label="Decrease quantity"
                className={clsx(
                    'flex items-center justify-center transition-colors duration-150',
                    'text-maroon-700 hover:bg-saffron-50 active:bg-saffron-100',
                    'disabled:opacity-40 disabled:cursor-not-allowed',
                    isSm ? 'w-7 h-7' : 'w-9 h-9'
                )}
            >
                <Minus size={isSm ? 12 : 14} strokeWidth={2.5} />
            </button>

            <span
                aria-live="polite"
                aria-atomic
                className={clsx(
                    'font-semibold text-maroon-900 select-none text-center tabular-nums',
                    'border-x border-cream-200 bg-cream-50',
                    isSm ? 'w-7 h-7 text-xs leading-7' : 'w-10 h-9 text-sm leading-9'
                )}
            >
                {value}
            </span>

            <button
                onClick={increment}
                disabled={value >= max}
                aria-label="Increase quantity"
                className={clsx(
                    'flex items-center justify-center transition-colors duration-150',
                    'text-maroon-700 hover:bg-saffron-50 active:bg-saffron-100',
                    'disabled:opacity-40 disabled:cursor-not-allowed',
                    isSm ? 'w-7 h-7' : 'w-9 h-9'
                )}
            >
                <Plus size={isSm ? 12 : 14} strokeWidth={2.5} />
            </button>
        </div>
    );
}
