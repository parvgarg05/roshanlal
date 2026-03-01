'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Package } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface Category {
    id: string;
    label: string;
    labelHindi: string;
    emoji: string;
    description: string;
    gstRate: number;
    _count?: { products: number };
}

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        label: '',
        labelHindi: '',
        emoji: '',
        description: '',
        gstRate: '5',
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const res = await fetch('/api/admin/categories');
            const data = await res.json();
            setCategories(data.categories || []);
        } catch (err) {
            console.error('Failed to load categories:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            const res = await fetch('/api/admin/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            
            if (!res.ok) {
                setError(data.error || 'Failed to create category');
                return;
            }

            setCategories([...categories, data.category]);
            setFormData({ id: '', label: '', labelHindi: '', emoji: '', description: '', gstRate: '5' });
            setShowAddForm(false);
        } catch (err) {
            setError('Failed to create category');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            const res = await fetch(`/api/admin/categories?id=${id}`, {
                method: 'DELETE',
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.error || 'Failed to delete category');
                return;
            }

            setCategories(categories.filter((c) => c.id !== id));
        } catch (err) {
            alert('Failed to delete category');
        }
    };

    if (loading) {
        return (
            <div className="p-8 bg-cream-50 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-cream-200 rounded w-1/4"></div>
                        <div className="h-4 bg-cream-200 rounded w-1/3"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-cream-50 min-h-screen">
            <div className="max-w-7xl mx-auto p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div className="flex-1 min-w-0">
                        <h1 className="font-display text-3xl font-bold text-maroon-900">Categories</h1>
                        <p className="text-maroon-600 mt-1">Manage product categories</p>
                    </div>
                    <Button
                        variant="primary"
                        onClick={() => setShowAddForm(!showAddForm)}
                        leftIcon={<Plus size={18} />}
                        className="shadow-lg shrink-0"
                    >
                        Add Category
                    </Button>
                </div>

                {/* Add Form */}
                {showAddForm && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-cream-200">
                        <h2 className="font-display text-xl font-bold text-maroon-900 mb-6">Add New Category</h2>
                        <form onSubmit={handleAdd} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <Input
                                    label="Category ID"
                                    value={formData.id}
                                    onChange={(e) => setFormData({ ...formData, id: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                    placeholder="e.g., cashew-sweets"
                                    required
                                />
                                <Input
                                    label="Label (English)"
                                    value={formData.label}
                                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                    placeholder="e.g., Cashew Sweets"
                                    required
                                />
                                <Input
                                    label="Label (Hindi)"
                                    value={formData.labelHindi}
                                    onChange={(e) => setFormData({ ...formData, labelHindi: e.target.value })}
                                    placeholder="e.g., काजू मिठाई"
                                    required
                                />
                                <Input
                                    label="Emoji"
                                    value={formData.emoji}
                                    onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                                    placeholder="e.g., 🥜"
                                    required
                                    maxLength={2}
                                />
                            </div>
                            <Input
                                label="Description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="e.g., Premium sweets made with fine cashews."
                            />
                            <Input
                                label="GST Rate (%)"
                                type="number"
                                value={formData.gstRate}
                                onChange={(e) => setFormData({ ...formData, gstRate: e.target.value })}
                                placeholder="5"
                                required
                            />

                            {error && (
                                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                                    {error}
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <Button type="submit" variant="primary" loading={submitting}>
                                    Create Category
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => {
                                        setShowAddForm(false);
                                        setError(null);
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-cream-200 hover:border-saffron-200 group"
                        >
                            {/* Card Header with Emoji */}
                            <div className="bg-gradient-to-br from-cream-50 to-saffron-50 p-6 border-b border-cream-200">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center text-4xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                            {category.emoji}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-display font-bold text-lg text-maroon-900 truncate">
                                                {category.label}
                                            </h3>
                                            <p className="text-sm text-maroon-600 font-devanagari mt-0.5 truncate">
                                                {category.labelHindi}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(category.id)}
                                        className="text-red-500 hover:text-white hover:bg-red-500 p-2.5 rounded-xl transition-all duration-200 flex-shrink-0 ml-2"
                                        aria-label="Delete category"
                                        title="Delete category"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-6 space-y-4">
                                <p className="text-sm text-maroon-600 leading-relaxed min-h-[40px]">
                                    {category.description}
                                </p>

                                {/* Stats Footer */}
                                <div className="flex items-center justify-between pt-4 border-t border-cream-100">
                                    <div className="flex items-center gap-2 text-maroon-700">
                                        <div className="w-8 h-8 rounded-lg bg-saffron-50 flex items-center justify-center">
                                            <Package size={16} className="text-saffron-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-maroon-400">Products</p>
                                            <p className="text-sm font-bold text-maroon-900">
                                                {category._count?.products || 0}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-maroon-400">GST Rate</p>
                                        <p className="text-sm font-bold text-maroon-900">{category.gstRate}%</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {categories.length === 0 && !showAddForm && (
                    <div className="bg-white rounded-2xl border-2 border-dashed border-cream-300 p-12 text-center">
                        <div className="w-20 h-20 rounded-full bg-cream-100 mx-auto mb-4 flex items-center justify-center">
                            <Package size={32} className="text-maroon-400" />
                        </div>
                        <h3 className="font-display text-xl font-bold text-maroon-900 mb-2">No Categories Yet</h3>
                        <p className="text-maroon-500 mb-6">Create your first category to organize products</p>
                        <Button variant="primary" onClick={() => setShowAddForm(true)} leftIcon={<Plus size={18} />}>
                            Add First Category
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
