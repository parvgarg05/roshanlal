'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, X, Phone, Search } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import CartDrawer from '@/components/CartDrawer';
import clsx from 'clsx';

const NAV_LINKS = [
    { label: 'Home', href: '/' },
    { label: 'All Items', href: '/items' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
    const { totalItems } = useCart();
    const pathname = usePathname();
    const [currentSearchParams, setCurrentSearchParams] = useState<URLSearchParams | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const isNavLinkActive = (href: string) => {
        const [path, queryString] = href.split('?');

        if (pathname !== path) return false;

        if (!queryString) {
            if (path === '/items') {
                return !currentSearchParams?.get('category');
            }
            return true;
        }

        const linkParams = new URLSearchParams(queryString);
        return Array.from(linkParams.entries()).every(([key, value]) => currentSearchParams?.get(key) === value);
    };

    // Lock body scroll when mobile menu open
    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isMenuOpen]);

    useEffect(() => {
        setCurrentSearchParams(new URLSearchParams(window.location.search));
    }, [pathname]);

    return (
        <>
            <header className="sticky top-0 z-50 bg-cream-100 shadow-warm-sm">
                <div className="section-container">
                    <div className="flex items-center justify-between h-16">

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group shrink-0">
                            <div className="relative w-14 h-14 md:w-16 md:h-16">
                                <Image
                                    src="/logo.png"
                                    alt="L.Roshanlal Ji Sweets"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                            <div className="flex flex-col leading-tight hidden sm:flex">
                                <span className="font-display font-bold text-maroon-950 text-base leading-5 group-hover:text-saffron-600 transition-colors duration-200">
                                    L.Roshanlal Ji
                                </span>
                                <span className="text-[10px] font-sans text-gold-600 tracking-wider uppercase font-medium">
                                    Sweets
                                </span>
                            </div>
                        </Link>

                        {/* Desktop nav */}
                        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={clsx(
                                        'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                                        isNavLinkActive(link.href)
                                            ? 'text-saffron-600'
                                            : 'text-maroon-800 hover:text-saffron-600 hover:bg-saffron-50'
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Right actions */}
                        <div className="flex items-center gap-2">
                            {/* Search (desktop) */}
                            <Link
                                href="/items"
                                aria-label="Search sweets"
                                className="hidden md:flex items-center justify-center w-10 h-10 rounded-xl text-maroon-700 hover:text-saffron-600 hover:bg-saffron-50 transition-all duration-200"
                            >
                                <Search size={20} />
                            </Link>

                            {/* Call (mobile) */}
                            <a
                                href="tel:+917055513961"
                                aria-label="Call us"
                                className="flex md:hidden items-center justify-center w-10 h-10 rounded-xl text-maroon-700 hover:text-saffron-600 hover:bg-saffron-50 transition-all duration-200 touch-target"
                            >
                                <Phone size={20} />
                            </a>

                            {/* Cart button → opens CartDrawer */}
                            <button
                                onClick={() => setIsCartOpen(true)}
                                aria-label={`Open cart, ${totalItems} items`}
                                className="relative flex items-center justify-center w-10 h-10 rounded-xl text-maroon-700 hover:text-saffron-600 hover:bg-saffron-50 transition-all duration-200 touch-target"
                            >
                                <ShoppingCart size={20} />
                                {totalItems > 0 && (
                                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-saffron-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-fade-up">
                                        {totalItems > 99 ? '99+' : totalItems}
                                    </span>
                                )}
                            </button>

                            <Link
                                href="/orders"
                                className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 border border-saffron-400 text-saffron-700 bg-transparent text-sm font-semibold rounded-xl hover:bg-saffron-50 hover:border-saffron-500 transition-all duration-200"
                            >
                                My Orders
                            </Link>

                            {/* Hamburger */}
                            <button
                                onClick={() => setIsMenuOpen((v) => !v)}
                                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                                aria-expanded={isMenuOpen}
                                className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl text-maroon-800 hover:bg-saffron-50 transition-colors duration-200 touch-target"
                            >
                                {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile menu backdrop */}
            <div
                className={clsx(
                    'fixed inset-0 z-40 transition-all duration-300 md:hidden',
                    isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                )}
                onClick={() => setIsMenuOpen(false)}
                aria-hidden
            >
                <div className="absolute inset-0 bg-maroon-950/40 backdrop-blur-sm" />
            </div>

            {/* Mobile drawer */}
            <aside
                className={clsx(
                    'fixed top-0 right-0 bottom-0 z-50 w-72 shadow-warm-lg bg-cream-100 flex flex-col transition-transform duration-300 ease-in-out md:hidden',
                    isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                )}
                aria-label="Mobile menu"
            >
                <div className="flex items-center justify-between px-5 h-16 border-b border-cream-200">
                    <span className="font-display font-bold text-maroon-950 text-lg">Menu</span>
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        aria-label="Close menu"
                        className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-saffron-50 text-maroon-700 transition-colors touch-target"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-1" aria-label="Mobile navigation">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMenuOpen(false)}
                            className={clsx(
                                'flex items-center px-4 py-3.5 rounded-2xl text-base font-medium transition-all duration-200 touch-target',
                                isNavLinkActive(link.href)
                                    ? 'text-saffron-600'
                                    : 'text-maroon-800 hover:text-saffron-600 hover:bg-saffron-50'
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-cream-200 flex flex-col gap-3">
                    <Link
                        href="/orders"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center justify-center w-full py-3.5 bg-saffron-gradient text-white font-semibold rounded-2xl shadow-warm hover:shadow-glow transition-all duration-200 touch-target"
                    >
                        My Orders
                    </Link>
                    <a
                        href="tel:+917055513961"
                        className="flex items-center justify-center gap-2 w-full py-3 border border-maroon-200 text-maroon-800 font-medium rounded-2xl hover:bg-maroon-50 transition-colors duration-200 touch-target"
                    >
                        <Phone size={16} />
                        Call to Order
                    </a>
                </div>
            </aside>

            {/* Cart Drawer */}
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
}
