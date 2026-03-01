'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import type { ProductCategory, CategoryMeta } from '@/types';

interface CategoryCarouselProps {
    categories: CategoryMeta[];
    activeCategory?: ProductCategory;
    onSelect?: (category: ProductCategory) => void;
    /** If true, categories link to /items?category=xxx instead of calling onSelect */
    asLinks?: boolean;
}

export default function CategoryCarousel({
    categories,
    activeCategory = 'all',
    onSelect,
    asLinks = false,
}: CategoryCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (dir: 'left' | 'right') => {
        const el = scrollRef.current;
        if (!el) return;
        el.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
    };

    return (
        <div className="relative flex items-center gap-2">
            {/* Left arrow */}
            <button
                onClick={() => scroll('left')}
                className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-warm-sm text-maroon-600 hover:bg-saffron-50 hover:text-saffron-600 transition-all duration-150 touch-target"
                aria-label="Scroll categories left"
            >
                <ChevronLeft size={16} />
            </button>

            {/* Scroll container */}
            <div
                ref={scrollRef}
                className="flex items-center gap-2.5 overflow-x-auto no-scrollbar scroll-smooth py-1 flex-1"
                role="list"
                aria-label="Product categories"
            >
                {categories.map((cat) => {
                    const isActive = activeCategory === cat.id;
                    const chipClass = clsx(
                        'shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium',
                        'border transition-all duration-200 cursor-pointer whitespace-nowrap touch-target',
                        isActive
                            ? 'bg-saffron-gradient text-white border-transparent shadow-warm'
                            : 'bg-white text-maroon-700 border-cream-200 hover:border-saffron-300 hover:text-saffron-600 hover:bg-saffron-50'
                    );

                    if (asLinks) {
                        return (
                            <Link
                                key={cat.id}
                                href={cat.id === 'all' ? '/items' : `/items?category=${cat.id}`}
                                role="listitem"
                                className={chipClass}
                            >
                                <span aria-hidden>{cat.emoji}</span>
                                {cat.label}
                            </Link>
                        );
                    }

                    return (
                        <button
                            key={cat.id}
                            role="listitem"
                            onClick={() => onSelect?.(cat.id)}
                            className={chipClass}
                            aria-pressed={isActive}
                        >
                            <span aria-hidden>{cat.emoji}</span>
                            {cat.label}
                        </button>
                    );
                })}
            </div>

            {/* Right arrow */}
            <button
                onClick={() => scroll('right')}
                className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-warm-sm text-maroon-600 hover:bg-saffron-50 hover:text-saffron-600 transition-all duration-150 touch-target"
                aria-label="Scroll categories right"
            >
                <ChevronRight size={16} />
            </button>
        </div>
    );
}
