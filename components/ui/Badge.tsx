import clsx from 'clsx';

type BadgeVariant = 'saffron' | 'gold' | 'maroon' | 'green' | 'gray';

interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    size?: 'xs' | 'sm';
    className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
    saffron: 'bg-saffron-100 text-saffron-700 border border-saffron-200',
    gold: 'bg-gold-100   text-gold-700   border border-gold-200',
    maroon: 'bg-maroon-100 text-maroon-700 border border-maroon-200',
    green: 'bg-green-100  text-green-700  border border-green-200',
    gray: 'bg-gray-100   text-gray-600   border border-gray-200',
};

export default function Badge({
    children,
    variant = 'saffron',
    size = 'xs',
    className,
}: BadgeProps) {
    return (
        <span
            className={clsx(
                'inline-flex items-center font-semibold rounded-full',
                variantStyles[variant],
                size === 'xs' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
                className
            )}
        >
            {children}
        </span>
    );
}
