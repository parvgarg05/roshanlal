'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartToast from '@/components/CartToast';

export default function SiteChrome({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    const isAdminRoute = pathname?.startsWith('/admin');
    if (isAdminRoute) {
        return <main className="flex-1">{children}</main>;
    }

    return (
        <>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartToast />
        </>
    );
}
