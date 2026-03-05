'use client';

import { ChevronUp } from 'lucide-react';
import { useEffect, useState } from 'react';

const SCROLL_THRESHOLD = 120;

function getScrollTop() {
    return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

export default function ScrollToTopButton() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setIsVisible(getScrollTop() > SCROLL_THRESHOLD);
        };

        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleMoveToTop = () => {
        const scrollingElement = document.scrollingElement || document.documentElement;

        try {
            scrollingElement.scrollTo({ top: 0, behavior: 'smooth' });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch {
            scrollingElement.scrollTop = 0;
            document.body.scrollTop = 0;
            window.scrollTo(0, 0);
        }
    };

    return (
        <button
            type="button"
            onClick={handleMoveToTop}
            aria-label="Move to top"
            className={`fixed bottom-5 right-5 z-[80] h-11 w-11 rounded-full bg-maroon-900 text-cream-50 shadow-warm-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 focus-visible:ring-offset-2 ${
                isVisible
                    ? 'translate-y-0 opacity-100 pointer-events-auto'
                    : 'translate-y-2 opacity-0 pointer-events-none'
            }`}
        >
            <ChevronUp size={20} className="mx-auto" />
        </button>
    );
}
