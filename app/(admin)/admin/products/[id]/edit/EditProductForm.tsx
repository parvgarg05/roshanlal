'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { updateProduct } from './actions';

type CategoryOption = {
    id: string;
    label: string;
    emoji: string;
};

type EditableProduct = {
    id: string;
    name: string;
    nameHindi: string;
    slug: string;
    description: string;
    price: number;
    categoryId: string;
    image: string;
    weightGrams: number;
    shelfLifeDays: number;
    isVeg: boolean;
    isAvailable: boolean;
    isFeatured: boolean;
    isTodaySpecial: boolean;
    allergens: string[];
    ingredients: string | null;
};

export default function EditProductForm({
    product,
    categories,
}: {
    product: EditableProduct;
    categories: CategoryOption[];
}) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        const form = new FormData(e.currentTarget);

        startTransition(async () => {
            const result = await updateProduct(product.id, form);
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
                    <h1 className="font-display font-bold text-3xl text-maroon-900">Edit Product</h1>
                    <p className="text-maroon-500 mt-1">Update details for {product.name}.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl border border-cream-200 shadow-warm-sm space-y-8">
                {error && (
                    <div className="p-4 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100">
                        {error}
                    </div>
                )}

                <div>
                    <h3 className="text-lg font-semibold text-maroon-900 border-b border-cream-200 pb-2 mb-4">Core Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Input name="name" label="Product Name (English)" required defaultValue={product.name} />
                        <Input name="nameHindi" label="Product Name (Hindi)" required defaultValue={product.nameHindi} />
                        <Input name="slug" label="URL Slug" required className="lowercase" defaultValue={product.slug} />

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-maroon-900">Category</label>
                            <select
                                name="categoryId"
                                required
                                defaultValue={product.categoryId}
                                className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-50 focus:border-saffron-500 focus:bg-white focus:ring-2 focus:ring-saffron-200 outline-none transition-all"
                            >
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.emoji} {cat.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-maroon-900 border-b border-cream-200 pb-2 mb-4">Pricing & Packaging</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <Input name="price" type="number" step="1" min="1" label="Price (₹)" required defaultValue={product.price} />
                        <Input name="weightGrams" type="number" step="1" min="1" label="Weight (grams)" required defaultValue={product.weightGrams} />
                        <Input name="shelfLifeDays" type="number" step="1" min="1" label="Shelf Life (days)" required defaultValue={product.shelfLifeDays} />
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-maroon-900 border-b border-cream-200 pb-2 mb-4">Marketing</h3>
                    <div className="space-y-5">
                        <Input name="image" label="Image URL" defaultValue={product.image} />
                        <Input name="allergens" label="Allergens (comma separated)" defaultValue={product.allergens.join(', ')} />
                        <Input name="ingredients" label="Ingredients" defaultValue={product.ingredients ?? ''} />

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-maroon-900">Description</label>
                            <textarea
                                name="description"
                                required
                                rows={3}
                                defaultValue={product.description}
                                className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-50 focus:border-saffron-500 focus:bg-white focus:ring-2 focus:ring-saffron-200 outline-none transition-all resize-none"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-maroon-900 border-b border-cream-200 pb-2 mb-4">Visibility</h3>
                    <div className="flex flex-wrap gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="isAvailable" value="true" defaultChecked={product.isAvailable} className="w-4 h-4 text-saffron-600 rounded" />
                            <span className="text-sm font-medium text-maroon-800">Available in Store</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="isFeatured" value="true" defaultChecked={product.isFeatured} className="w-4 h-4 text-saffron-600 rounded" />
                            <span className="text-sm font-medium text-maroon-800">Mark as Featured</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="isTodaySpecial" value="true" defaultChecked={product.isTodaySpecial} className="w-4 h-4 text-saffron-600 rounded" />
                            <span className="text-sm font-medium text-maroon-800">Today&apos;s Special</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="isVeg" value="true" defaultChecked={product.isVeg} className="w-4 h-4 text-green-600 rounded" />
                            <span className="text-sm font-medium text-maroon-800">100% Vegetarian</span>
                        </label>
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <Button type="submit" variant="primary" size="lg" loading={isPending} leftIcon={<Save size={18} />}>
                        Update Product
                    </Button>
                </div>
            </form>
        </div>
    );
}
