'use client';

import { useState, useTransition } from 'react';
import { updateDeliveryPricing } from './actions';
import { formatCurrency } from '@/lib/utils';

type PricingValues = {
    freeDeliveryThreshold: number;
    reducedDeliveryThreshold: number;
    reducedDeliveryFee: number;
    baseDeliveryFee: number;
};

export default function PricingForm({ initialValues }: { initialValues: PricingValues }) {
    const [message, setMessage] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const [values, setValues] = useState<PricingValues>(initialValues);

    const previewSubtotals = [200, 350, 600];

    return (
        <form
            action={(formData) => {
                setMessage(null);
                startTransition(async () => {
                    const result = await updateDeliveryPricing(formData);
                    if (result?.error) {
                        setMessage(result.error);
                        return;
                    }
                    setMessage('Pricing updated successfully.');
                });
            }}
            className="space-y-5"
        >
            <div className="grid sm:grid-cols-2 gap-4">
                <Field
                    name="freeDeliveryThreshold"
                    label="Free Delivery Threshold (₹)"
                    value={values.freeDeliveryThreshold}
                    onValueChange={(value) => setValues((prev) => ({ ...prev, freeDeliveryThreshold: value }))}
                    hint="Delivery becomes free at or above this subtotal."
                />
                <Field
                    name="reducedDeliveryThreshold"
                    label="Reduced Fee Threshold (₹)"
                    value={values.reducedDeliveryThreshold}
                    onValueChange={(value) => setValues((prev) => ({ ...prev, reducedDeliveryThreshold: value }))}
                    hint="Applies reduced fee at or above this subtotal."
                />
                <Field
                    name="reducedDeliveryFee"
                    label="Reduced Delivery Fee (₹)"
                    value={values.reducedDeliveryFee}
                    onValueChange={(value) => setValues((prev) => ({ ...prev, reducedDeliveryFee: value }))}
                    hint="Fee charged above reduced threshold and below free threshold."
                />
                <Field
                    name="baseDeliveryFee"
                    label="Base Delivery Fee (₹)"
                    value={values.baseDeliveryFee}
                    onValueChange={(value) => setValues((prev) => ({ ...prev, baseDeliveryFee: value }))}
                    hint="Fee charged below reduced threshold."
                />
            </div>

            <div className="rounded-xl border border-cream-200 bg-cream-50 p-4 space-y-2">
                <p className="text-sm font-semibold text-maroon-900">Pricing Preview</p>
                <div className="space-y-1.5 text-sm text-maroon-700">
                    {previewSubtotals.map((subtotal) => {
                        const charge = getPreviewDeliveryCharge(subtotal, values);
                        return (
                            <div key={subtotal} className="flex items-center justify-between">
                                <span>For subtotal {formatCurrency(subtotal)}</span>
                                <span className={charge === 0 ? 'text-green-700 font-semibold' : 'font-medium'}>
                                    {charge === 0 ? 'FREE' : formatCurrency(charge)}
                                </span>
                            </div>
                        );
                    })}
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
                {isPending ? 'Saving...' : 'Save Pricing'}
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
    return (
        <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-maroon-800">{label}</span>
            <input
                type="number"
                name={name}
                min={0}
                step={1}
                value={value}
                onChange={(e) => onValueChange(Math.max(0, Number(e.target.value) || 0))}
                className="h-11 px-3 rounded-xl border border-cream-300 bg-white text-maroon-900 focus:outline-none focus:ring-2 focus:ring-saffron-500"
                required
            />
            <span className="text-xs text-maroon-500">{hint}</span>
        </label>
    );
}

function getPreviewDeliveryCharge(subtotal: number, values: PricingValues): number {
    if (subtotal >= values.freeDeliveryThreshold) return 0;
    if (subtotal >= values.reducedDeliveryThreshold) return values.reducedDeliveryFee;
    return values.baseDeliveryFee;
}
