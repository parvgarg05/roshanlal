'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

const SLIDES = [
    {
        src: '/images/products/kaju-katli.png',
        alt: 'Premium Kaju Katli',
    },
    {
        src: '/images/products/motichoor-ladoo.png',
        alt: 'Fresh Motichoor Ladoo',
    },
    {
        src: '/images/products/kaju-roll.png',
        alt: 'Delicious Kaju Roll',
    },
];

const AUTO_PLAY_INTERVAL_MS = 3000;

export default function HomeImageSlider() {
    const [activeIndex, setActiveIndex] = useState(0);
    const totalSlides = useMemo(() => SLIDES.length, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % totalSlides);
        }, AUTO_PLAY_INTERVAL_MS);

        return () => clearInterval(timer);
    }, [totalSlides]);

    return (
        <div className="relative h-[300px] sm:h-[380px] lg:h-[480px] w-full overflow-hidden rounded-3xl border border-cream-200/50 shadow-warm-lg">
            {SLIDES.map((slide, index) => (
                <div
                    key={slide.src}
                    className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                        activeIndex === index ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    <Image
                        src={slide.src}
                        alt={slide.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 520px"
                        priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-black/5" />
                </div>
            ))}

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 to-transparent" />

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 drop-shadow-md">
                {SLIDES.map((slide, index) => (
                    <span
                        key={`${slide.src}-dot`}
                        className={`h-2.5 rounded-full transition-all duration-300 ${
                            activeIndex === index ? 'w-6 bg-white' : 'w-2.5 bg-white/60'
                        }`}
                        aria-hidden="true"
                    />
                ))}
            </div>
        </div>
    );
}