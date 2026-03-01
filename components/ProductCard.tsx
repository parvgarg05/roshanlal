'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import clsx from 'clsx';
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import QuantitySelector from '@/components/ui/QuantitySelector';

interface ProductCardProps {
    product: Product;
    className?: string;
}

export default function ProductCard({ product: initialProduct, className }: ProductCardProps) {
    const { items, addItem, updateQuantity } = useCart();
    const cartItem = items.find((i) => i.id === initialProduct.id);
    const qty = cartItem?.quantity ?? 0;

    const [justAdded, setJustAdded] = useState(false);
    const [product, setProduct] = useState(initialProduct);
    const [hoveredRating, setHoveredRating] = useState<number | null>(null);
    const [isRatingSubmitting, setIsRatingSubmitting] = useState(false);

    const handleAdd = () => {
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            weightGrams: product.weightGrams,
            gstRate: product.categoryData?.gstRate ?? 5,
            isFreeDeliveryEligible: product.badge?.toLowerCase() === 'free delivery',
        });
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 1400);
    };

    const handleRatingClick = async (rating: number) => {
        if (isRatingSubmitting) return;
        
        setIsRatingSubmitting(true);
        try {
            const res = await fetch(`/api/products/${product.id}/rate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating }),
            });

            if (res.ok) {
                const data = await res.json();
                setProduct({ 
                    ...product, 
                    rating: data.rating, 
                    reviewCount: data.reviewCount 
                });
            }
        } catch (error) {
            console.error('Failed to submit rating:', error);
        } finally {
            setIsRatingSubmitting(false);
        }
    };

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <article
            className={clsx(
                'group card-base overflow-hidden flex flex-col',
                className
            )}
        >
            {/* ── Image ── */}
            <div
                className="relative w-full aspect-[4/3] overflow-hidden bg-cream-100 block"
            >
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                    loading="lazy"
                />

                {/* Badges */}
                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
                    {/* Veg dot */}
                    <span
                        className={clsx(
                            'w-5 h-5 flex items-center justify-center rounded border-2 bg-white shadow-sm',
                            product.isVeg ? 'border-green-600' : 'border-red-500'
                        )}
                        title={product.isVeg ? 'Vegetarian' : 'Non-vegetarian'}
                    >
                        <span className={clsx('w-2.5 h-2.5 rounded-full', product.isVeg ? 'bg-green-600' : 'bg-red-500')} />
                    </span>

                    {discount > 0 && (
                        <span className="px-2 py-0.5 bg-maroon-gradient text-cream-100 text-[10px] font-bold rounded-lg shadow-sm">
                            -{discount}%
                        </span>
                    )}
                </div>
            </div>

            {/* ── Content ── */}
            <div className="flex flex-col flex-1 p-4 gap-2">
                <div className="group/title">
                    <h3 className="font-display font-semibold text-maroon-900 text-xl leading-snug line-clamp-1 group-hover/title:text-saffron-600 transition-colors duration-200">
                        {product.name}{' '}
                        <span className="font-devanagari text-maroon-600">({product.nameHindi})</span>
                    </h3>
                </div>

                <p className="text-xs text-maroon-500 leading-relaxed line-clamp-2 flex-1">
                    {product.description}
                </p>

                {/* Rating - Interactive */}
                <div className="flex items-center gap-1.5">
                    <div 
                        className="flex items-center gap-0.5"
                        onMouseLeave={() => setHoveredRating(null)}
                    >
                        {Array.from({ length: 5 }).map((_, i) => {
                            const starValue = i + 1;
                            const isFilled = hoveredRating !== null 
                                ? starValue <= hoveredRating 
                                : starValue <= Math.floor(product.rating);
                            
                            return (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => handleRatingClick(starValue)}
                                    onMouseEnter={() => setHoveredRating(starValue)}
                                    disabled={isRatingSubmitting}
                                    className="cursor-pointer hover:scale-125 transition-transform disabled:cursor-not-allowed disabled:opacity-50"
                                    aria-label={`Rate ${starValue} stars`}
                                >
                                    <Star
                                        size={14}
                                        className={clsx(
                                            'transition-colors duration-150',
                                            isFilled 
                                                ? 'text-gold-400 fill-gold-400' 
                                                : 'text-cream-300 fill-cream-300'
                                        )}
                                    />
                                </button>
                            );
                        })}
                    </div>
                    <span className="text-[11px] text-maroon-600 font-medium">{product.rating.toFixed(1)}</span>
                    <span className="text-[10px] text-maroon-400">({product.reviewCount})</span>
                </div>

                {/* Price + CTA */}
                <div className="flex items-center justify-between mt-1 pt-3 border-t border-cream-200">
                    <div>
                        <span className="text-lg font-bold text-maroon-900 leading-none">₹{product.price}</span>
                        {product.originalPrice && (
                            <span className="ml-1.5 text-xs text-maroon-400 line-through">₹{product.originalPrice}</span>
                        )}
                        <p className="text-[10px] text-maroon-400 mt-0.5">per {product.weightGrams}g</p>
                    </div>

                    {qty === 0 ? (
                        <button
                            onClick={handleAdd}
                            className={clsx(
                                'flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all duration-200 touch-target',
                                justAdded
                                    ? 'bg-green-500 text-white shadow-sm scale-95'
                                    : 'bg-saffron-gradient text-white shadow-warm-sm hover:shadow-glow hover:-translate-y-0.5 active:translate-y-0'
                            )}
                            aria-label={`Add ${product.name} to cart`}
                        >
                            {justAdded ? (
                                <>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polyline points="20 6 9 17 4 12" /></svg>
                                    Added!
                                </>
                            ) : (
                                <>
                                    <ShoppingCart size={13} />
                                    Add
                                </>
                            )}
                        </button>
                    ) : (
                        <QuantitySelector
                            size="sm"
                            value={qty}
                            min={0}
                            onChange={(v) => updateQuantity(product.id, v)}
                        />
                    )}
                </div>
            </div>
        </article>
    );
}
