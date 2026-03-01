import { getProductsByCategory, getCategories } from '@/lib/products';
import ItemsClient from './ItemsClient';
import type { ProductCategory } from '@/types';

const VALID_CATEGORIES: ProductCategory[] = [
    'all',
    'cashew-sweets',
    'ladoo',
    'milk-sweets',
    'bengali-sweets',
    'hot-fresh',
    'savories',
    'dry-fruits-ghee',
    'cookies-bakery',
];

export default async function ItemsPage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string }>;
}) {
    const { category } = await searchParams;
    const initialCategory = VALID_CATEGORIES.includes(category as ProductCategory)
        ? (category as ProductCategory)
        : 'all';

    // Fetch all products and categories on the server
    const initialProducts = await getProductsByCategory('all');
    const categories = await getCategories();

    return <ItemsClient initialProducts={initialProducts} initialCategory={initialCategory} categories={categories} />;
}
