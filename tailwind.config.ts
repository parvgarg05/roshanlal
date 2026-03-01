import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Primary – vibrant saffron orange
                saffron: {
                    50: '#fff7ed',
                    100: '#ffedd5',
                    200: '#fed7aa',
                    300: '#fdba74',
                    400: '#fb923c',
                    500: '#f97316', // main saffron
                    600: '#ea6a06',
                    700: '#c2570a',
                    800: '#9a4413',
                    900: '#7c3a14',
                    950: '#431a07',
                },
                // Secondary – deep rich maroon
                maroon: {
                    50: '#fdf2f2',
                    100: '#fce4e4',
                    200: '#fbcece',
                    300: '#f6a8a8',
                    400: '#ef7676',
                    500: '#e44e4e',
                    600: '#c93232',
                    700: '#9b1f1f',
                    800: '#7b1c1c',
                    900: '#6b1f1f',
                    950: '#3b0a0a', // main deep maroon
                },
                // Accent – warm antique gold
                gold: {
                    50: '#fffbeb',
                    100: '#fef3c7',
                    200: '#fde68a',
                    300: '#fcd34d',
                    400: '#fbbf24',
                    500: '#f59e0b', // main gold
                    600: '#d97706',
                    700: '#b45309',
                    800: '#92400e',
                    900: '#78350f',
                    950: '#451a03',
                },
                // Background – warm off-white / cream
                cream: {
                    50: '#fefdf8',
                    100: '#fdf8ee',
                    200: '#faf0d7',
                    300: '#f5e3b4',
                    400: '#edd08c',
                    500: '#e5bd6a',
                },
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
                display: ['var(--font-playfair)', 'Georgia', 'serif'],
                devanagari: ['var(--font-noto-serif-devanagari)', 'serif'],
            },
            borderRadius: {
                '2xl': '1rem',
                '3xl': '1.5rem',
                '4xl': '2rem',
            },
            boxShadow: {
                'warm-sm': '0 1px 3px rgba(249,115,22,0.08), 0 1px 2px rgba(249,115,22,0.06)',
                'warm': '0 4px 6px rgba(249,115,22,0.07), 0 2px 4px rgba(249,115,22,0.06)',
                'warm-md': '0 10px 15px rgba(249,115,22,0.07), 0 4px 6px rgba(249,115,22,0.05)',
                'warm-lg': '0 20px 25px rgba(249,115,22,0.06), 0 10px 10px rgba(249,115,22,0.04)',
                'glow': '0 0 20px rgba(249,115,22,0.35)',
                'card': '0 2px 16px rgba(59,10,10,0.10)',
            },
            backgroundImage: {
                'saffron-gradient': 'linear-gradient(135deg, #f97316 0%, #d97706 100%)',
                'maroon-gradient': 'linear-gradient(135deg, #9b1f1f 0%, #3b0a0a 100%)',
                'warm-gradient': 'linear-gradient(135deg, #fff7ed 0%, #fdf8ee 100%)',
                'hero-gradient': 'linear-gradient(135deg, #3b0a0a 0%, #7c3a14 50%, #c2570a 100%)',
            },
            keyframes: {
                'fade-up': {
                    '0%': { opacity: '0', transform: 'translateY(16px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                'bounce-soft': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-4px)' },
                },
            },
            animation: {
                'fade-up': 'fade-up 0.4s ease-out both',
                'shimmer': 'shimmer 2s linear infinite',
                'bounce-soft': 'bounce-soft 2s ease-in-out infinite',
            },
        },
    },
    plugins: [],
};

export default config;
