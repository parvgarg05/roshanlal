import React from 'react';
import clsx from 'clsx';

/* ─── Types ─────────────────────────────────────────────── */
type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
    loading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
    as?: 'button' | 'a';
    href?: string;
}

/* ─── Style Maps ────────────────────────────────────────── */
const variantStyles: Record<Variant, string> = {
    primary:
        'bg-saffron-gradient text-white shadow-warm-sm hover:shadow-glow hover:-translate-y-0.5 active:translate-y-0 active:shadow-warm-sm',
    secondary:
        'bg-maroon-gradient text-cream-100 shadow-warm-sm hover:shadow-warm-md hover:-translate-y-0.5 active:translate-y-0',
    outline:
        'border-2 border-saffron-500 text-saffron-600 bg-transparent hover:bg-saffron-50 hover:border-saffron-600 active:bg-saffron-100',
    ghost:
        'text-maroon-700 bg-transparent hover:bg-cream-200 hover:text-maroon-900 active:bg-cream-300',
    danger:
        'bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0',
};

const sizeStyles: Record<Size, string> = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5 rounded-xl min-h-[32px]',
    md: 'px-5   py-2.5 text-sm gap-2   rounded-xl min-h-[40px]',
    lg: 'px-6   py-3   text-base gap-2 rounded-2xl min-h-[48px]',
    xl: 'px-8   py-4   text-lg gap-3   rounded-2xl min-h-[56px]',
};

/* ─── Spinner ───────────────────────────────────────────── */
function Spinner({ size }: { size: Size }) {
    const dim = size === 'sm' ? 'w-3 h-3' : size === 'xl' ? 'w-5 h-5' : 'w-4 h-4';
    return (
        <svg
            className={clsx(dim, 'animate-spin shrink-0')}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
    );
}

/* ─── Component ─────────────────────────────────────────── */
export default function Button({
    variant = 'primary',
    size = 'md',
    loading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    className,
    children,
    disabled,
    ...props
}: ButtonProps) {
    const isDisabled = disabled || loading;

    return (
        <button
            disabled={isDisabled}
            className={clsx(
                // Base
                'inline-flex items-center justify-center font-semibold',
                'transition-all duration-200 select-none',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 focus-visible:ring-offset-2',
                // Variant + Size
                variantStyles[variant],
                sizeStyles[size],
                // State
                fullWidth && 'w-full',
                isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
                className
            )}
            {...props}
        >
            {loading ? (
                <Spinner size={size} />
            ) : leftIcon ? (
                <span className="shrink-0">{leftIcon}</span>
            ) : null}
            {children && <span>{children}</span>}
            {!loading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </button>
    );
}
