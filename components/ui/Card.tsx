import React from 'react';
import Image from 'next/image';
import clsx from 'clsx';

/* ─── Card (Base Container) ─────────────────────────────── */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    hover?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
    hover = true,
    padding = 'none',
    className,
    children,
    ...props
}: CardProps) {
    const padStyles = {
        none: '',
        sm: 'p-3',
        md: 'p-5',
        lg: 'p-6 sm:p-8',
    };

    return (
        <div
            className={clsx(
                'card-base overflow-hidden',
                hover && 'cursor-pointer',
                padStyles[padding],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

/* ─── Product Card ──────────────────────────────────────── */
export interface ProductCardProps {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    image: string;
    badge?: string;
    badgeColor?: 'saffron' | 'gold' | 'maroon' | 'green';
    rating?: number;
    reviewCount?: number;
    isVeg?: boolean;
    onAddToCart?: () => void;
    className?: string;
}

export function ProductCard({
    name,
    description,
    price,
    originalPrice,
    image,
    rating,
    reviewCount,
    isVeg = true,
    onAddToCart,
    className,
}: ProductCardProps) {
    const discount = originalPrice
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : 0;

    return (
        <div
            className={clsx(
                'group card-base overflow-hidden flex flex-col',
                className
            )}
        >
            {/* Image container */}
            <div className="relative w-full aspect-[4/3] overflow-hidden bg-cream-100">
                <Image
                    src={image}
                    alt={name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                    loading="lazy"
                />

                {/* Badges */}
                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
                    {/* Veg indicator */}
                    <span
                        className={clsx(
                            'w-5 h-5 flex items-center justify-center rounded border-2',
                            isVeg ? 'border-green-600 bg-white' : 'border-red-600 bg-white'
                        )}
                        title={isVeg ? 'Vegetarian' : 'Non-vegetarian'}
                    >
                        <span
                            className={clsx(
                                'w-2.5 h-2.5 rounded-full',
                                isVeg ? 'bg-green-600' : 'bg-red-600'
                            )}
                        />
                    </span>

                    {/* Discount badge */}
                    {discount > 0 && (
                        <span className="px-2 py-0.5 bg-maroon-gradient text-cream-100 text-[10px] font-bold rounded-lg">
                            -{discount}%
                        </span>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-4 gap-2">
                <h3 className="font-display font-semibold text-maroon-900 text-base leading-tight line-clamp-1">
                    {name}
                </h3>
                <p className="text-xs text-maroon-500 leading-relaxed line-clamp-2 flex-1">
                    {description}
                </p>

                {/* Rating */}
                {rating !== undefined && (
                    <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <svg
                                    key={i}
                                    className={clsx(
                                        'w-3 h-3',
                                        i < Math.floor(rating) ? 'text-gold-400' : 'text-cream-300'
                                    )}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    aria-hidden
                                >
                                    <path d="M9.049 2.927c.396-.905 1.507-.905 1.902 0l1.518 3.674 4.006.34c.94.08 1.32 1.221.612 1.843l-3.025 2.673.927 3.898c.22.924-.77 1.634-1.568 1.174L10 14.347l-3.421 1.882c-.798.46-1.787-.25-1.568-1.174l.927-3.898L2.913 8.784c-.708-.622-.328-1.763.612-1.843l4.006-.34 1.518-3.674z" />
                                </svg>
                            ))}
                        </div>
                        <span className="text-xs text-maroon-500 font-medium">{rating.toFixed(1)}</span>
                        {reviewCount !== undefined && (
                            <span className="text-[10px] text-maroon-400">({reviewCount})</span>
                        )}
                    </div>
                )}

                {/* Price + CTA */}
                <div className="flex items-center justify-between mt-1 pt-3 border-t border-cream-200">
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-maroon-900 leading-none">
                            ₹{price.toFixed(0)}
                        </span>
                        {originalPrice && (
                            <span className="text-xs text-maroon-400 line-through">
                                ₹{originalPrice.toFixed(0)}
                            </span>
                        )}
                    </div>

                    <button
                        onClick={onAddToCart}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-saffron-gradient text-white text-xs font-semibold rounded-xl shadow-warm-sm hover:shadow-glow hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 touch-target"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
                        </svg>
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Card;
