'use client';

import Link from 'next/link';
import { useState } from 'react';
import { PackageSearch, LayoutDashboard, Tags, BadgeIndianRupee, FolderTree, Menu, X, Clock3 } from 'lucide-react';
import LogoutButton from './LogoutButton';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="h-[100dvh] bg-cream-50 flex overflow-hidden">
            {/* Sidebar - Desktop */}
            <aside className="w-64 bg-maroon-900 text-cream-100 flex flex-col hidden md:flex shrink-0">
                <div className="p-6 border-b border-maroon-800">
                    <h2 className="font-display font-bold text-xl text-saffron-400">Admin Panel</h2>
                    <p className="text-xs text-maroon-300 mt-1">L.Roshanlal Ji Sweets</p>
                </div>

                <nav className="flex-1 py-6 px-4 space-y-1">
                    <NavItem href="/admin" icon={LayoutDashboard} label="Overview" />
                    <NavItem href="/admin/orders" icon={PackageSearch} label="Orders" />
                    <NavItem href="/admin/products" icon={Tags} label="Products" />
                    <NavItem href="/admin/categories" icon={FolderTree} label="Categories" />
                    <NavItem href="/admin/pricing" icon={BadgeIndianRupee} label="Pricing" />
                    <NavItem href="/admin/timing" icon={Clock3} label="Order Timing" />
                </nav>

                <div className="p-4 border-t border-maroon-800">
                    <LogoutButton />
                </div>
            </aside>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside className={`fixed top-0 left-0 bottom-0 w-72 bg-maroon-900 text-cream-100 flex flex-col z-50 transform transition-transform duration-300 md:hidden ${
                mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <div className="p-6 border-b border-maroon-800 flex items-center justify-between">
                    <div>
                        <h2 className="font-display font-bold text-xl text-saffron-400">Admin Panel</h2>
                        <p className="text-xs text-maroon-300 mt-1">L.Roshanlal Ji Sweets</p>
                    </div>
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-cream-100 p-2 hover:bg-maroon-800 rounded-lg"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 py-6 px-4 space-y-1" onClick={() => setMobileMenuOpen(false)}>
                    <NavItem href="/admin" icon={LayoutDashboard} label="Overview" />
                    <NavItem href="/admin/orders" icon={PackageSearch} label="Orders" />
                    <NavItem href="/admin/products" icon={Tags} label="Products" />
                    <NavItem href="/admin/categories" icon={FolderTree} label="Categories" />
                    <NavItem href="/admin/pricing" icon={BadgeIndianRupee} label="Pricing" />
                    <NavItem href="/admin/timing" icon={Clock3} label="Order Timing" />
                </nav>

                <div className="p-4 border-t border-maroon-800">
                    <LogoutButton />
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
                {/* Mobile Header */}
                <div className="md:hidden bg-maroon-900 text-white p-4 flex items-center sticky top-0 z-30">
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="text-cream-100 p-2 hover:bg-maroon-800 rounded-lg transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                    <h2 className="font-display font-bold text-lg text-saffron-400 flex-1 text-center">Admin Panel</h2>
                    <div className="flex items-center">
                        <LogoutButton iconOnly />
                    </div>
                </div>
                {children}
            </main>
        </div>
    );
}

function NavItem({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-cream-200 hover:bg-maroon-800 hover:text-white transition-colors"
        >
            <Icon size={18} />
            <span className="font-medium text-sm">{label}</span>
        </Link>
    );
}
