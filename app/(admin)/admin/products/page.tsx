import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import { formatCurrency, withImageVersion } from '@/lib/utils';
import ProductToggle from './ProductToggle';
import { Pencil, Plus } from 'lucide-react';
import Link from 'next/link';
import DeleteProductButton from './DeleteProductButton';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminProductsPage() {
    const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
        include: { category: true },
    });

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-display font-bold text-3xl text-maroon-900">Products ({products.length})</h1>
                    <p className="text-maroon-500 mt-1">Manage your catalogue. Toggling &apos;Today&apos;s Special&apos; updates the homepage instantly.</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="inline-flex items-center gap-2 bg-maroon-900 text-cream-50 px-4 py-2.5 rounded-xl hover:bg-maroon-800 transition-colors font-semibold shadow-warm-sm"
                >
                    <Plus size={18} />
                    Add Product
                </Link>
            </div>

            <div className="bg-white rounded-2xl border border-cream-200 shadow-warm-sm overflow-hidden auto-cols-auto overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap min-w-[920px]">
                    <thead className="bg-cream-50 text-maroon-500 font-semibold border-b border-cream-200">
                        <tr>
                            <th className="px-5 py-4 w-12">Image</th>
                            <th className="px-5 py-4">Product Name</th>
                            <th className="px-5 py-4 text-right">Price</th>
                            <th className="px-5 py-4 text-center">Actions</th>
                            <th className="px-5 py-4 text-center">Available</th>
                            <th className="px-5 py-4 text-center">Featured</th>
                            <th className="px-5 py-4 text-center">Today&apos;s Special</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-cream-100">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-cream-50/50 transition-colors">
                                <td className="px-5 py-3">
                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-cream-200">
                                        <Image
                                            src={withImageVersion(product.image, product.updatedAt.getTime())}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                            sizes="48px"
                                        />
                                    </div>
                                </td>
                                <td className="px-5 py-3">
                                    <div className="text-maroon-900 font-bold">{product.name}</div>
                                    <div className="text-maroon-500 text-xs flex gap-2 items-center">
                                        <span>{product.nameHindi}</span>
                                        <span className="text-cream-300">•</span>
                                        <span>{product.category.label}</span>
                                    </div>
                                </td>
                                <td className="px-5 py-3 text-right">
                                    <div className="text-maroon-900 font-semibold">{formatCurrency(product.price)}</div>
                                    <div className="text-maroon-400 text-xs">/{product.weightGrams}g</div>
                                </td>
                                <td className="px-5 py-3 text-center">
                                    <div className="inline-flex items-center gap-2">
                                        <Link
                                            href={`/admin/products/${product.id}/edit`}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cream-300 text-maroon-700 hover:bg-cream-50 transition-colors"
                                        >
                                            <Pencil size={14} />
                                            Edit
                                        </Link>
                                        <DeleteProductButton id={product.id} name={product.name} />
                                    </div>
                                </td>
                                <td className="px-5 py-3 text-center">
                                    <ProductToggle id={product.id} field="isAvailable" currentValue={product.isAvailable} />
                                </td>
                                <td className="px-5 py-3 text-center">
                                    <ProductToggle id={product.id} field="isFeatured" currentValue={product.isFeatured} />
                                </td>
                                <td className="px-5 py-3 text-center">
                                    <ProductToggle id={product.id} field="isTodaySpecial" currentValue={product.isTodaySpecial} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
