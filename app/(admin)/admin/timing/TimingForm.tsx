'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { Clock3 } from 'lucide-react';
import { formatOrderWindowIST } from '@/lib/orderTiming';
import { updateOrderTiming } from './actions';

type TimingValues = {
    startHour: number;
    endHour: number;
};

export default function TimingForm({ initialValues }: { initialValues: TimingValues }) {
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<string | null>(null);
    const [values, setValues] = useState<TimingValues>(initialValues);

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                setMessage(null);
                startTransition(async () => {
                    const result = await updateOrderTiming(values);
                    if (result?.error) {
                        setMessage(result.error);
                        return;
                    }
                    setMessage('Order timing updated successfully.');
                });
            }}
            className="space-y-5"
        >
            <div className="grid sm:grid-cols-2 gap-4">
                <Field
                    name="startHour"
                    label="Start Time (IST)"
                    value={values.startHour}
                    onValueChange={(value) => setValues((prev) => ({ ...prev, startHour: value }))}
                    hint="Example: 9:00 AM"
                />
                <Field
                    name="endHour"
                    label="End Time (IST)"
                    value={values.endHour}
                    onValueChange={(value) => setValues((prev) => ({ ...prev, endHour: value }))}
                    hint="Example: 9:00 PM"
                />
            </div>

            <div className="rounded-2xl border border-maroon-100 bg-white p-5 shadow-warm-sm">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-maroon-900">
                        <Clock3 size={18} className="text-saffron-500" />
                        <p className="text-sm font-semibold">Customers can order between</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-cream-50 border border-maroon-100 text-sm font-semibold text-maroon-900">
                            {formatHourOption(values.startHour)}
                        </span>
                        <span className="text-xs text-maroon-500">to</span>
                        <span className="px-3 py-1 rounded-full bg-cream-50 border border-maroon-100 text-sm font-semibold text-maroon-900">
                            {formatHourOption(values.endHour)}
                        </span>
                        <span className="text-xs text-maroon-500">(IST)</span>
                    </div>
                    <p className="text-xs text-maroon-500">Orders outside this window will be blocked automatically.</p>
                    <p className="text-xs text-maroon-500">Current window: {formatOrderWindowIST(values)}</p>
                </div>
            </div>

            {message && (
                <p className="text-sm text-maroon-700 bg-cream-50 border border-cream-200 rounded-xl px-3 py-2">
                    {message}
                </p>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-2 bg-maroon-900 text-cream-50 px-4 py-2.5 rounded-xl hover:bg-maroon-800 transition-colors font-semibold shadow-warm-sm disabled:opacity-50"
            >
                {isPending ? 'Saving...' : 'Save Timing'}
            </button>
        </form>
    );
}

function Field({
    name,
    label,
    value,
    onValueChange,
    hint,
}: {
    name: string;
    label: string;
    value: number;
    onValueChange: (value: number) => void;
    hint: string;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!isOpen) return;

        function handleOutsideClick(event: MouseEvent) {
            if (!containerRef.current) return;
            if (!containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleOutsideClick);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen]);

    return (
        <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-maroon-800">{label}</span>
            <div className="relative" ref={containerRef}>
                <button
                    type="button"
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="h-12 w-full rounded-2xl border border-maroon-100 bg-white px-4 pr-11 text-left text-sm font-semibold text-maroon-900 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-saffron-500"
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                >
                    {formatHourOption(value)}
                </button>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-saffron-600">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M6 9l6 6 6-6" />
                    </svg>
                </div>

                {isOpen && (
                    <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-warm-md">
                        <div className="max-h-64 overflow-y-auto p-1">
                            {HOURS.map((hour) => {
                                const isActive = hour === value;
                                return (
                                    <button
                                        key={hour}
                                        type="button"
                                        role="option"
                                        aria-selected={isActive}
                                        onClick={() => {
                                            onValueChange(hour);
                                            setIsOpen(false);
                                        }}
                                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors ${
                                            isActive
                                                ? 'bg-saffron-100 text-maroon-900 font-semibold'
                                                : 'text-maroon-700 hover:bg-cream-100'
                                        }`}
                                    >
                                        <span>{formatHourOption(hour)}</span>
                                        {isActive && (
                                            <span className="text-[10px] uppercase tracking-widest text-saffron-700">Selected</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
            <span className="text-xs text-maroon-500">{hint}</span>
        </label>
    );
}

const HOURS = Array.from({ length: 24 }, (_, index) => index);

function formatHourOption(hour: number): string {
    const normalizedHour = ((hour % 24) + 24) % 24;
    const hour12 = normalizedHour % 12 === 0 ? 12 : normalizedHour % 12;
    const period = normalizedHour >= 12 ? 'PM' : 'AM';
    return `${hour12}:00 ${period}`;
}
