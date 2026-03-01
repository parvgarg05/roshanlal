import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display, Noto_Serif_Devanagari } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import SiteChrome from '@/components/SiteChrome';

/* ─── Font Definitions ──────────────────────────────────── */
const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
    display: 'swap',
    weight: ['400', '600', '700'],
    style: ['normal', 'italic'],
});

const notoSerifDevanagari = Noto_Serif_Devanagari({
    subsets: ['devanagari'],
    variable: '--font-noto-serif-devanagari',
    display: 'swap',
    weight: ['400', '600', '700'],
});

/* ─── Metadata ──────────────────────────────────────────── */
export const metadata: Metadata = {
    title: {
        default: 'L.Roshanlal Ji Sweets – Premium Indian Sweets | Nadrai Gate, UP',
        template: '%s | L.Roshanlal Ji Sweets',
    },
    description:
        'Order fresh, handcrafted Indian sweets and mithai online from L.Roshanlal Ji Sweets – a trusted sweet shop at Circular Road, Malgodam Crossing Nadrai Gate, UP 207123. Delivering happiness since generations.',
    keywords: [
        'Indian sweets', 'mithai', 'online sweet shop UP', 'L.Roshanlal Ji sweets',
        'Nadrai Gate sweets', 'traditional Indian mithai', 'gulab jamun', 'barfi',
    ],
    openGraph: {
        type: 'website',
        locale: 'en_IN',
        siteName: 'L.Roshanlal Ji Sweets',
        title: 'L.Roshanlal Ji Sweets – Premium Indian Sweets',
        description: 'Handcrafted Indian sweets delivered to your door.',
    },
    robots: { index: true, follow: true },
    icons: {
        icon: [
            { url: '/logo4-32.png', sizes: '32x32', type: 'image/png' },
            { url: '/logo4-64.png', sizes: '64x64', type: 'image/png' },
            { url: '/logo4-128.png', sizes: '128x128', type: 'image/png' },
        ],
        apple: { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    },
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    themeColor: '#f97316',
};

/* ─── Root Layout ───────────────────────────────────────── */
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            className={`${inter.variable} ${playfair.variable} ${notoSerifDevanagari.variable}`}
        >
            <body className="min-h-screen bg-cream-100 flex flex-col">
                <CartProvider>
                    <SiteChrome>{children}</SiteChrome>
                </CartProvider>
            </body>
        </html>
    );
}
