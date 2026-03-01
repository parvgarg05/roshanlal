'use client';

import { useState, useMemo, useCallback, useTransition, useEffect, useRef } from 'react';
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import CategoryCarousel from '@/components/CategoryCarousel';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import Input from '@/components/ui/Input';
import type { Product, ProductCategory, CategoryMeta } from '@/types';

const PER_PAGE = 12;

export default function ItemsClient({
    initialProducts,
    initialCategory = 'all',
    categories,
}: {
    initialProducts: Product[];
    initialCategory?: ProductCategory;
    categories: CategoryMeta[];
}) {
    const [activeCategory, setActiveCategory] = useState<ProductCategory>(initialCategory);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>('default');
    const [isPending, startTransition] = useTransition();
    const productSectionRef = useRef<HTMLDivElement | null>(null);
    const pageHeaderRef = useRef<HTMLDivElement | null>(null);
    const hasPaginationMounted = useRef(false);

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }, []);

    useEffect(() => {
        setActiveCategory(initialCategory);
        setPage(1);
    }, [initialCategory]);

    useEffect(() => {
        if (!hasPaginationMounted.current) {
            hasPaginationMounted.current = true;
            return;
        }

        if (!pageHeaderRef.current) {
            return;
        }

        const top =
            pageHeaderRef.current.getBoundingClientRect().top +
            window.pageYOffset -
            64;

        window.scrollTo({
            top: Math.max(top, 0),
            behavior: 'smooth',
        });
    }, [page]);

    // Filtered + sorted products
    const filtered = useMemo(() => {
        let list = initialProducts.filter((p) => p.isAvailable);

        if (activeCategory !== 'all') {
            list = list.filter((p) => p.category === activeCategory);
        }

        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    p.nameHindi.includes(q) ||
                    p.description.toLowerCase().includes(q)
            );
        }

        if (sortBy === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
        if (sortBy === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
        if (sortBy === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);

        return list;
    }, [initialProducts, activeCategory, search, sortBy]);

    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const handleCategory = useCallback((cat: ProductCategory) => {
        startTransition(() => {
            setActiveCategory(cat);
            setPage(1);
        });
    }, []);

    const handleSearch = (val: string) => {
        setSearch(val);
        setPage(1);
    };

    return (
        <div className="min-h-screen bg-cream-100">

            {/* ── Page header ── */}
            <div ref={pageHeaderRef} className="bg-maroon-gradient py-10 text-cream-50">
                <div className="section-container">
                    <p className="text-xs font-bold uppercase tracking-widest text-gold-300 mb-2">Our Collection</p>
                    <h1 className="font-display font-bold text-3xl sm:text-4xl mb-1">All Sweets & Mithai</h1>
                    <p className="text-cream-300 text-sm">
                        {filtered.length} item{filtered.length !== 1 ? 's' : ''} found
                        {activeCategory !== 'all' && ` in ${categories.find(c => c.id === activeCategory)?.label}`}
                    </p>
                </div>
            </div>

            {/* ── Filters row ── */}
            <div className="bg-white border-b border-cream-200 shadow-warm-sm py-3 relative z-30">
                <div className="section-container flex flex-wrap gap-3 items-center">
                    {/* Search */}
                    <div className="flex-1 min-w-[180px] max-w-xs">
                        <Input
                            placeholder="Search sweets…"
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            leftElement={<Search size={16} />}
                            rightElement={search ? (
                                <button onClick={() => handleSearch('')} className="text-maroon-400 hover:text-maroon-700">
                                    <X size={14} />
                                </button>
                            ) : undefined}
                            size="sm"
                        />
                    </div>

                    {/* Sort */}
                    <div className="flex items-center gap-2">
                        <SlidersHorizontal size={15} className="text-maroon-400 shrink-0" />
                        <select
                            value={sortBy}
                            onChange={(e) => { setSortBy(e.target.value as typeof sortBy); setPage(1); }}
                            className="text-sm border border-cream-200 rounded-xl px-3 py-1.5 bg-white text-maroon-700 focus:outline-none focus:ring-2 focus:ring-saffron-400 min-h-[36px]"
                        >
                            <option value="default">Sort: Default</option>
                            <option value="rating">Top Rated</option>
                            <option value="price-asc">Price: Low → High</option>
                            <option value="price-desc">Price: High → Low</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* ── Category carousel ── */}
            <div className="bg-white border-b border-cream-100 py-3">
                <div className="section-container">
                    <CategoryCarousel categories={categories} activeCategory={activeCategory} onSelect={handleCategory} />
                </div>
            </div>

            {/* ── Product grid ── */}
            <div ref={productSectionRef} className="section-container py-8">
                {isPending ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                    </div>
                ) : paginated.length === 0 ? (
                    <div className="text-center py-20">
                        <h3 className="font-display font-bold text-xl text-maroon-800 mb-2">No sweets found</h3>
                        <p className="text-maroon-400 text-sm mb-6">Try a different search term or category</p>
                        <button
                            onClick={() => { setSearch(''); setActiveCategory('all'); setPage(1); }}
                            className="text-saffron-600 font-semibold text-sm hover:underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {paginated.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {/* ── Pagination ── */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-10">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-cream-200 bg-white text-maroon-600 hover:bg-saffron-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    aria-label="Previous page"
                                >
                                    <ChevronLeft size={16} />
                                </button>

                                {Array.from({ length: totalPages }).map((_, i) => {
                                    const pg = i + 1;
                                    // Show first, last, current ±1, and ellipsis
                                    const show = pg === 1 || pg === totalPages || Math.abs(pg - page) <= 1;
                                    const isEllipsis = !show && (pg === 2 || pg === totalPages - 1);
                                    if (!show && !isEllipsis) return null;
                                    if (isEllipsis) return <span key={pg} className="text-maroon-300 text-sm">…</span>;
                                    return (
                                        <button
                                            key={pg}
                                            onClick={() => setPage(pg)}
                                            className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-150 ${pg === page
                                                ? 'bg-saffron-gradient text-white shadow-warm-sm'
                                                : 'border border-cream-200 bg-white text-maroon-600 hover:bg-saffron-50'
                                                }`}
                                            aria-label={`Page ${pg}`}
                                            aria-current={pg === page ? 'page' : undefined}
                                        >
                                            {pg}
                                        </button>
                                    );
                                })}

                                <button
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-cream-200 bg-white text-maroon-600 hover:bg-saffron-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    aria-label="Next page"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
