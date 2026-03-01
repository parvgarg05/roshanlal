import clsx from 'clsx';

interface SkeletonProps {
    className?: string;
    rounded?: 'sm' | 'md' | 'lg' | 'full';
}

export function Skeleton({ className, rounded = 'md' }: SkeletonProps) {
    const roundedMap = { sm: 'rounded', md: 'rounded-xl', lg: 'rounded-2xl', full: 'rounded-full' };
    return (
        <div
            className={clsx(
                'animate-pulse bg-gradient-to-r from-cream-200 via-cream-100 to-cream-200',
                'bg-[length:200%_100%] animate-shimmer',
                roundedMap[rounded],
                className
            )}
            aria-hidden="true"
        />
    );
}

export function ProductCardSkeleton() {
    return (
        <div className="card-base overflow-hidden flex flex-col">
            <Skeleton className="w-full aspect-[4/3]" rounded="sm" />
            <div className="p-4 flex flex-col gap-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
                <div className="flex items-center justify-between pt-2 border-t border-cream-100">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-9 w-20" rounded="lg" />
                </div>
            </div>
        </div>
    );
}
