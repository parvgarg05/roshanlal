'use client';

import { useEffect, useTransition, useState } from 'react';
import { createProduct } from './actions';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

type CategoryOption = {
    id: string;
    label: string;
    emoji: string;
};

export default function NewProductPage() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState('');
    const [categories, setCategories] = useState<CategoryOption[]>([]);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const res = await fetch('/api/admin/categories', { cache: 'no-store' });
                const data = await res.json();
                if (res.ok) {
                    setCategories((data.categories || []).map((cat: any) => ({
                        id: cat.id,
                        label: cat.label,
                        emoji: cat.emoji,
                    })));
                }
            } catch (fetchError) {
                console.error('Failed to load categories:', fetchError);
            }
        };

        void loadCategories();
    }, []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        const form = new FormData(e.currentTarget);

        startTransition(async () => {
            const result = await createProduct(form);
            if (result?.error) {
                setError(result.error);
            }
        });
    };

    return (
        <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/admin/products" className="p-2 rounded-xl bg-white border border-cream-200 text-maroon-600 hover:bg-cream-100 transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="font-display font-bold text-3xl text-maroon-900">Add New Product</h1>
                    <p className="text-maroon-500 mt-1">Create a new mithai for your store.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl border border-cream-200 shadow-warm-sm space-y-8">
                {error && (
                    <div className="p-4 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100">
                        {error}
                    </div>
                )}

                {/* 1. Core Info */}
                <div>
                    <h3 className="text-lg font-semibold text-maroon-900 border-b border-cream-200 pb-2 mb-4">Core Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Input name="name" label="Product Name (English)" required placeholder="e.g. Badam Peda" />
                        <Input name="nameHindi" label="Product Name (Hindi)" required placeholder="e.g. बादाम पेड़ा" />

                        <Input name="slug" label="URL Slug" required placeholder="e.g. badam-peda" className="lowercase" />

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-maroon-900">Category</label>
                            <select
                                name="categoryId"
                                required
                                disabled={categories.length === 0}
                                className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-50 focus:border-saffron-500 focus:bg-white focus:ring-2 focus:ring-saffron-200 outline-none transition-all disabled:opacity-60"
                            >
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.emoji} {cat.label}</option>
                                ))}
                            </select>
                            {categories.length === 0 && (
                                <p className="text-xs text-maroon-500">No categories found. Please create a category first.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* 2. Commerce */}
                <div>
                    <h3 className="text-lg font-semibold text-maroon-900 border-b border-cream-200 pb-2 mb-4">Pricing & Packaging</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <Input name="price" type="number" step="1" min="1" label="Price (₹)" required placeholder="400" />
                        <Input name="weightGrams" type="number" step="1" min="1" label="Weight (grams)" required placeholder="500" />
                        <Input name="shelfLifeDays" type="number" step="1" min="1" label="Shelf Life (days)" required placeholder="7" />
                    </div>
                </div>

                {/* 3. Media & Description */}
                <div>
                    <h3 className="text-lg font-semibold text-maroon-900 border-b border-cream-200 pb-2 mb-4">Marketing</h3>
                    <div className="space-y-5">
                        <Input name="image" label="Image URL" placeholder="https://images.unsplash.com/..." />

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-maroon-900">Description</label>
                            <textarea
                                name="description"
                                required
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-50 focus:border-saffron-500 focus:bg-white focus:ring-2 focus:ring-saffron-200 outline-none transition-all resize-none"
                                placeholder="A rich, mouth-watering traditional sweet..."
                            />
                        </div>
                    </div>
                </div>

                {/* 4. Toggles */}
                <div>
                    <h3 className="text-lg font-semibold text-maroon-900 border-b border-cream-200 pb-2 mb-4">Visibility</h3>
                    <div className="flex flex-wrap gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="isAvailable" value="true" defaultChecked className="w-4 h-4 text-saffron-600 rounded" />
                            <span className="text-sm font-medium text-maroon-800">Available in Store</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="isFeatured" value="true" className="w-4 h-4 text-saffron-600 rounded" />
                            <span className="text-sm font-medium text-maroon-800">Mark as Featured</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="isTodaySpecial" value="true" className="w-4 h-4 text-saffron-600 rounded" />
                            <span className="text-sm font-medium text-maroon-800">Today&apos;s Special</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="isVeg" value="true" defaultChecked className="w-4 h-4 text-green-600 rounded" />
                            <span className="text-sm font-medium text-maroon-800">100% Vegetarian</span>
                        </label>
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <Button type="submit" variant="primary" size="lg" loading={isPending} leftIcon={<Save size={18} />}>
                        Save Product
                    </Button>
                </div>
            </form>
        </div>
    );
}
