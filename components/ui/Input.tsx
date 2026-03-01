import React, { forwardRef } from 'react';
import clsx from 'clsx';

/* ─── Types ─────────────────────────────────────────────── */
type InputSize = 'sm' | 'md' | 'lg';
type InputVariant = 'default' | 'filled' | 'ghost';

export interface InputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    label?: string;
    error?: string;
    hint?: string;
    size?: InputSize;
    variant?: InputVariant;
    leftElement?: React.ReactNode;
    rightElement?: React.ReactNode;
    wrapperClassName?: string;
    required?: boolean;
}

/* ─── Style Maps ────────────────────────────────────────── */
const sizeStyles: Record<InputSize, { input: string; label: string }> = {
    sm: { input: 'py-1.5 text-sm min-h-[36px]', label: 'text-xs' },
    md: { input: 'py-2.5 text-sm min-h-[44px]', label: 'text-sm' },
    lg: { input: 'py-3   text-base min-h-[52px]', label: 'text-sm' },
};

const variantBase: Record<InputVariant, string> = {
    default: 'bg-white border border-cream-300 hover:border-saffron-400',
    filled: 'bg-cream-100 border border-cream-200 hover:border-saffron-400',
    ghost: 'bg-transparent border-b border-cream-300 rounded-none hover:border-saffron-400 px-0',
};

/* ─── Component ─────────────────────────────────────────── */
const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
    {
        label,
        error,
        hint,
        size = 'md',
        variant = 'default',
        leftElement,
        rightElement,
        wrapperClassName,
        className,
        id,
        required,
        ...props
    },
    ref
) {
    const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
        <div className={clsx('flex flex-col gap-1', wrapperClassName)}>
            {/* Label */}
            {label && (
                <label
                    htmlFor={inputId}
                    className={clsx(
                        'font-medium text-maroon-800 leading-tight',
                        sizeStyles[size].label
                    )}
                >
                    {label}
                    {required && <span className="text-saffron-500 ml-0.5" aria-hidden>*</span>}
                </label>
            )}

            {/* Input wrapper */}
            <div className="relative flex items-center">
                {/* Left element */}
                {leftElement && (
                    <span className="absolute left-3 flex items-center justify-center text-maroon-400 pointer-events-none select-none">
                        {leftElement}
                    </span>
                )}

                <input
                    ref={ref}
                    id={inputId}
                    required={required}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
                    className={clsx(
                        // Base
                        'w-full font-sans text-maroon-900 placeholder-maroon-300 rounded-2xl transition-all duration-200',
                        'outline-none focus:ring-2 focus:ring-saffron-500 focus:ring-offset-1 focus:border-saffron-500',
                        // Variant
                        variantBase[variant],
                        // Size
                        sizeStyles[size].input,
                        // Padding adjustments for icons
                        leftElement ? 'pl-10 pr-4' : 'px-4',
                        rightElement ? 'pr-10' : '',
                        // Error state
                        error && 'border-red-400 focus:ring-red-400 focus:border-red-400',
                        // Disabled
                        props.disabled && 'opacity-50 cursor-not-allowed bg-cream-200',
                        className
                    )}
                    {...props}
                />

                {/* Right element */}
                {rightElement && (
                    <span className="absolute right-3 flex items-center justify-center text-maroon-400 select-none">
                        {rightElement}
                    </span>
                )}
            </div>

            {/* Error */}
            {error && (
                <p id={`${inputId}-error`} className="text-xs text-red-500 flex items-center gap-1" role="alert">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden><circle cx="8" cy="8" r="8" opacity=".15" /><path d="M7.25 4.75h1.5v4.5h-1.5zM7.25 10.75h1.5v1.5h-1.5z" /></svg>
                    {error}
                </p>
            )}

            {/* Hint */}
            {!error && hint && (
                <p id={`${inputId}-hint`} className="text-xs text-maroon-400">
                    {hint}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';
export default Input;
