'use client';

import { RefreshCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export default function RefreshOrdersButton() {
    const router = useRouter();
    const [isRefreshing, startTransition] = useTransition();

    const handleRefresh = () => {
        startTransition(() => {
            router.refresh();
        });
    };

    return (
        <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-cream-200 bg-white px-4 text-sm font-semibold text-maroon-700 transition-colors hover:bg-cream-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
            <RefreshCcw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>
    );
}
