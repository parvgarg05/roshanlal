'use client';

import { CalendarDays } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface PastOrdersDateFilterProps {
    selectedDate: string;
    maxDate: string;
}

export default function PastOrdersDateFilter({ selectedDate, maxDate }: PastOrdersDateFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const applyDate = (value: string) => {
        const params = new URLSearchParams(searchParams?.toString());
        params.set('tab', 'past');

        if (value) {
            params.set('date', value);
        } else {
            params.delete('date');
        }

        router.push(`/admin/orders?${params.toString()}`);
    };

    const clearFilter = () => {
        router.push('/admin/orders?tab=past');
    };

    return (
        <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-cream-200 bg-white p-4 shadow-warm-sm">
            <label className="flex min-w-[220px] flex-col gap-1.5 text-xs text-maroon-600">
                <span className="font-semibold">Select Date</span>

                <div className="relative">
                    <CalendarDays size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-maroon-400" />
                    <input
                        type="date"
                        name="date"
                        value={selectedDate}
                        max={maxDate}
                        onChange={(event) => applyDate(event.target.value)}
                        className="h-10 w-full rounded-xl border border-cream-200 bg-cream-50 pl-9 pr-3 text-sm font-medium text-maroon-900 outline-none transition-colors focus:border-maroon-300 focus:bg-white focus:ring-2 focus:ring-maroon-200 cursor-pointer"
                    />
                </div>
            </label>

            <button
                type="button"
                onClick={clearFilter}
                className="h-10 px-4 rounded-xl text-xs font-semibold bg-cream-100 text-maroon-700 border border-cream-200 hover:bg-cream-200 transition-colors"
            >
                Clear Filter
            </button>
        </div>
    );
}
