'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
    Phone, Mail, MapPin, Clock, Instagram, Facebook,
    Youtube, Twitter, ArrowRight, Heart,
} from 'lucide-react';

const SOCIAL_LINKS = [
    { Icon: Instagram, href: 'https://www.instagram.com/roshanlalsweets/', label: 'Instagram', color: 'hover:text-pink-500' },
    { Icon: Facebook, href: 'https://www.facebook.com/roshanlalsweets/', label: 'Facebook', color: 'hover:text-blue-500' },
    // { Icon: Youtube, href: 'https://youtube.com', label: 'YouTube', color: 'hover:text-red-500' },
    // { Icon: Twitter, href: 'https://twitter.com', label: 'Twitter', color: 'hover:text-sky-500' },
];

const QUICK_LINKS = [
    { label: 'Home', href: '/' },
    { label: 'All Items', href: '/items' },
    { label: 'About Us', href: '/about' },
    { label: 'Cart', href: '/cart' },
    { label: 'Contact Us', href: '/contact' },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-maroon-gradient text-cream-200" role="contentinfo">
            {/* ── Top wave divider ── */}
            <div className="relative h-8 overflow-hidden">
                <svg
                    viewBox="0 0 1440 32"
                    className="absolute -bottom-px block w-full text-gold-300/25 fill-current"
                    preserveAspectRatio="none"
                >
                    <path d="M0,32 C360,0 1080,0 1440,32 L1440,32 L0,32 Z" />
                </svg>
            </div>

            <div className="section-container px-6 sm:px-8 lg:px-10 py-10 sm:py-12 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-20">

                    {/* ── Column 1: Brand ── */}
                    <div className="sm:col-span-2 lg:col-span-1 space-y-5">
                        {/* Logo mark */}
                        <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-white/10">
                                <Image
                                    src="/logo.png"
                                    alt="L.Roshanlal Ji Sweets"
                                    fill
                                    className="object-contain p-1"
                                />
                            </div>
                            <div>
                                <p className="font-display font-bold text-cream-100 text-xl leading-tight">
                                    L.Roshanlal Ji Sweets
                                </p>
                                <p className="text-gold-400 text-xs tracking-widest uppercase font-medium">
                                    Premium Indian Sweets
                                </p>
                            </div>
                        </div>

                        <p className="text-cream-200 text-[15px] leading-relaxed max-w-sm">
                            Traditional mithai, namkeen, and bakery items from our family shop in Kasganj.
                            Prepared fresh daily with the same trusted taste.
                        </p>

                        {/* Social icons */}
                        <div className="flex items-center gap-3 pt-1">
                            {SOCIAL_LINKS.map(({ Icon, href, label, color }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center border border-white/15 bg-transparent text-cream-300 ${color} hover:bg-white/10 transition-all duration-200 touch-target`}
                                >
                                    <Icon size={15} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* ── Column 2: Quick Links & Contact (Right side, flex layout) ── */}
                    <div className="lg:col-span-1 grid grid-cols-1 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-8 sm:gap-5 lg:gap-7">

                        {/* ── Quick Links ── */}
                        <div className="space-y-4">
                            <h3 className="font-display font-semibold text-gold-300 text-sm uppercase tracking-wider">
                                Quick Links
                            </h3>
                            <ul className="space-y-3.5">
                                {QUICK_LINKS.map(({ label, href }) => (
                                    <li key={href}>
                                        <Link
                                            href={href}
                                            className="flex items-center gap-2 text-sm text-cream-300 hover:text-gold-400 transition-colors duration-200 group"
                                        >
                                            <ArrowRight
                                                size={13}
                                                className="text-saffron-400 group-hover:translate-x-1 transition-transform duration-200"
                                            />
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* ── Column 3: Contact & Hours ── */}
                        <div className="space-y-4">
                            <h3 className="font-display font-semibold text-gold-300 text-sm uppercase tracking-wider">
                                Visit Us
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3 text-sm text-cream-300">
                                    <MapPin size={16} className="text-gold-400 mt-0.5 shrink-0" />
                                    <address className="not-italic leading-relaxed flex-1 min-w-0">
                                        Circular Road, Malgodam Crossing, Nadrai Gate, Uttar Pradesh 207123
                                    </address>
                                </li>
                                <li className="flex items-center gap-3 text-sm text-cream-300">
                                    <Phone size={16} className="text-gold-400 shrink-0" />
                                    <a href="tel:+917055513961" className="hover:text-gold-400 transition-colors duration-200">
                                        +91 70555 13961
                                    </a>
                                </li>
                                <li className="flex items-center gap-3 text-sm text-cream-300">
                                    <Mail size={16} className="text-gold-400 shrink-0" />
                                    <a href="mailto:info@roshanlaljisweets.com" className="hover:text-gold-400 transition-colors duration-200">
                                        info@roshanlaljisweets.com
                                    </a>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-cream-300">
                                    <Clock size={16} className="text-gold-400 mt-0.5 shrink-0" />
                                    <div className="leading-relaxed">
                                        <p>Mon – Sat: 8:00 AM – 9:00 PM</p>
                                        <p>Sunday: 9:00 AM – 8:00 PM</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* ── Google Maps Embed ── */}
                <div className="mt-8 sm:mt-10 rounded-2xl overflow-hidden border border-white/10 shadow-warm-lg relative group">
                    <iframe
                        title="L.Roshanlal Ji Sweets Location"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.6851427835!2d78.6533!3d27.8142!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1sRoshanlal%20%26%20Sons%20Kasganj!2sKasganj%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1640000000000"
                        width="100%"
                        height="200"
                        style={{ border: 0, display: 'block' }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                    <a
                        href="https://www.google.com/maps/search/Roshanlal+Kasganj/@27.8142,78.6533,15z"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-3 right-3 px-3 py-1.5 bg-white text-maroon-700 text-xs font-semibold rounded-lg shadow-warm hover:bg-cream-50 transition-all opacity-0 group-hover:opacity-100"
                    >
                        View Larger Map
                    </a>
                </div>

                {/* ── Bottom Bar ── */}
                <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cream-400">
                    <p>
                        © {currentYear} L.Roshanlal Ji Sweets. All rights reserved.
                    </p>
                    <p className="flex items-center gap-1">
                        {' '}
                        <a
                            href="https://www.linkedin.com/in/parvgarg23" // Replace with your actual LinkedIn URL
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium hover:text-[#D4AF37] transition-colors underline-offset-4 hover:underline"
                        >
                            Designed & Developed by Parv Garg
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
