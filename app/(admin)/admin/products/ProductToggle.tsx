'use client';

import { useTransition } from 'react';
import { toggleProductStatus } from './actions';

interface ProductToggleProps {
    id: string;
    field: 'isAvailable' | 'isFeatured' | 'isTodaySpecial';
    currentValue: boolean;
}

export default function ProductToggle({ id, field, currentValue }: ProductToggleProps) {
    const [isPending, startTransition] = useTransition();

    const handleToggle = () => {
        startTransition(async () => {
            await toggleProductStatus(id, field, currentValue);
        });
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isPending}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:ring-offset-2 disabled:opacity-50 transition-colors ${currentValue ? 'bg-saffron-500' : 'bg-gray-200'
                }`}
            role="switch"
            aria-checked={currentValue}
        >
            <span className="sr-only">Toggle {field}</span>
            <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${currentValue ? 'translate-x-2' : '-translate-x-2'
                    }`}
            />
        </button>
    );
}
