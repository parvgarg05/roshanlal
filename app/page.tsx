import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Phone } from 'lucide-react';
import Button from '@/components/ui/Button';
import ProductCard from '@/components/ProductCard';
import HomeImageSlider from '@/components/HomeImageSlider';
import { getFeaturedProducts, getTodaySpecials, getCategories } from '@/lib/products';
import { formatCurrency } from '@/lib/utils';

export default async function HomePage() {
    const todaySpecials = await getTodaySpecials();
    const featuredProducts = await getFeaturedProducts();
    const categories = await getCategories();

    return (
        <>
            {/* ══════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
            <section className="relative min-h-[88vh] flex items-center bg-hero-gradient overflow-hidden">
                {/* Decorative blobs */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-saffron-500/20 blur-3xl animate-bounce-soft" />
                    <div className="absolute bottom-0 -left-16 w-80 h-80 rounded-full bg-gold-400/10 blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-maroon-800/30 blur-3xl" />
                </div>

                {/* Diagonal decorative pattern */}
                <div className="absolute inset-0 opacity-[0.04]"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23f97316\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/svg%3E")' }}
                />

                <div className="section-container section-py relative z-10 w-full">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        {/* Left: Text */}
                        <div className="text-cream-50 animate-fade-up">
                            <p className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold-400/20 border border-gold-400/30 text-gold-300 text-xs font-semibold rounded-full uppercase tracking-widest mb-5">
                                Since 1942 · Kasganj, Uttar Pradesh
                            </p>

                            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-5">
                                Fresh{' '}
                                <span className="relative">
                                    <span className="text-gradient-saffron">Mithai</span>
                                </span>{' '}
                                <br className="hidden sm:block" />
                                Made Daily
                            </h1>

                            <p className="text-cream-300 text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
                                Classic sweets, namkeen, and bakery items prepared with desi ghee and trusted ingredients.
                                Order directly from our Nadrai Gate shop in Kasganj.
                            </p>

                            <div className="flex flex-wrap gap-3 mb-8">
                                <Link href="/items">
                                    <Button size="lg" variant="primary" rightIcon={<ArrowRight size={18} />}>
                                        Order Now
                                    </Button>
                                </Link>
                                <Link href="/about">
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="border-cream-400/50 text-cream-100 hover:bg-white/10 hover:border-cream-100"
                                    >
                                        Our Story
                                    </Button>
                                </Link>
                            </div>

                            {/* Trust badges */}
                            <div className="flex flex-wrap gap-3">
                                {['Pure Desi Ghee', 'Freshly Prepared', 'No Artificial Preservatives'].map((t) => (
                                    <span key={t} className="inline-flex items-center px-3 py-1 bg-white/10 border border-white/20 text-cream-200 text-xs rounded-full">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Right: Auto image slider */}
                        <div className="animate-fade-up [animation-delay:120ms]">
                            <HomeImageSlider />
                        </div>
                    </div>
                </div>

                {/* Bottom wave */}
                <div className="absolute -bottom-px left-0 right-0 leading-none">
                    <svg viewBox="0 0 1440 60" className="block w-full text-cream-100 fill-current" preserveAspectRatio="none">
                        <path d="M0,60 C360,0 1080,0 1440,60 L1440,60 L0,60 Z" />
                    </svg>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════
          TODAY'S SPECIAL
      ══════════════════════════════════════════════════════ */}
            <section className="section-py bg-cream-100">
                <div className="section-container">
                    {/* Heading */}
                    <div className="flex items-end justify-between mb-8 gap-4">
                        <div>
                            <h2 className="font-display font-bold text-3xl sm:text-4xl text-maroon-900">
                                Today&apos;s Special
                            </h2>
                            <p className="text-maroon-500 text-sm mt-1">Today&apos;s fresh picks from our kitchen.</p>
                        </div>
                        <Link
                            href="/items"
                            className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-saffron-600 hover:text-saffron-700 transition-colors"
                        >
                            View All <ArrowRight size={16} />
                        </Link>
                    </div>

                    {/* Cards grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {todaySpecials.slice(0, 3).map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════
          CATEGORY CAROUSEL
      ══════════════════════════════════════════════════════ */}
            <section className="py-10 bg-white border-y border-cream-200">
                <div className="section-container">
                    <div className="flex items-end justify-between mb-6 gap-4">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-saffron-600 mb-1">Browse By Type</p>
                            <h2 className="font-display font-bold text-2xl sm:text-3xl text-maroon-900">Our Sweet Families</h2>
                        </div>
                    </div>

                    {/* Category feature cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
                        {categories.filter((c) => c.id !== 'all').slice(0, 8).map((cat) => (
                            <Link
                                key={cat.id}
                                href={`/items?category=${cat.id}`}
                                className="group flex flex-col items-center gap-2 p-4 rounded-2xl bg-cream-50 border border-cream-200 hover:border-saffron-300 hover:bg-saffron-50 hover:shadow-warm transition-all duration-200"
                            >
                                <span className="text-3xl" aria-hidden>{cat.emoji}</span>
                                <span className="font-semibold text-sm text-maroon-800 group-hover:text-saffron-700 text-center leading-tight transition-colors">
                                    {cat.label}
                                </span>
                                <span className="text-[11px] text-maroon-400 text-center leading-tight line-clamp-2">
                                    {cat.description}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════
          FEATURED PRODUCTS
      ══════════════════════════════════════════════════════ */}
            <section className="section-py bg-cream-100">
                <div className="section-container">
                    <div className="flex items-end justify-between mb-8 gap-4">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-saffron-600 mb-1">Customer Favourites</p>
                            <h2 className="font-display font-bold text-3xl sm:text-4xl text-maroon-900">Featured Mithai</h2>
                            <p className="text-maroon-500 text-sm mt-1">Most-ordered sweets from our regular customers.</p>
                        </div>
                        <Link
                            href="/items"
                            className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-saffron-600 hover:text-saffron-700 transition-colors"
                        >
                            View All <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {featuredProducts.slice(0, 6).map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════
          BRAND STORY STRIP
      ══════════════════════════════════════════════════════ */}
            <section className="section-py bg-maroon-gradient text-cream-100 overflow-hidden relative">
                <div className="absolute inset-0 opacity-5"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23f59e0b\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/svg%3E")' }}
                />
                <div className="section-container relative z-10">
                    <div className="max-w-2xl mx-auto text-center">
                        <p className="text-gold-400 text-xs font-bold uppercase tracking-widest mb-3">Our Promise</p>
                        <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
                            Traditional Taste,<br />
                            Fresh Every Day
                        </h2>
                        <p className="text-cream-100 text-lg leading-relaxed mb-7">
                            We keep things simple: good ingredients, clean preparation, and consistent quality.
                            That&apos;s the same approach our family has followed for decades.
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                            <Link href="/items">
                                <Button variant="primary" size="lg" className="hover:brightness-110">
                                    Shop Now
                                </Button>
                            </Link>
                            <a href="tel:+917055513961">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    leftIcon={<Phone size={16} />}
                                    className="border-saffron-300 text-saffron-300 hover:bg-saffron-500/15 hover:border-saffron-300"
                                >
                                    Call to Order
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
