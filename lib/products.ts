import { prisma } from './prisma';
import type { Product, ProductCategory } from '@/types';
import { withImageVersion } from './utils';
import { unstable_cache } from 'next/cache';
import { CACHE_TAGS } from './cache-tags';

/**
 * ─── Database-Backed Product Queries ─────────────────────────
 * These replace the previous static array filters.
 * They run directly against the Postgres database via Prisma.
 */

// Helper: map Prisma Product to Frontend Product type
// (Prisma returns Dates for createdAt/updatedAt, we just need the core fields)
function mapToProductType(dbProduct: any): Product {
    const catData = CATEGORIES.find(c => c.id === dbProduct.categoryId) || {
        id: 'all', label: 'Unknown', labelHindi: '', emoji: '', description: '', gstRate: 5
    };

    return {
        id: dbProduct.id,
        name: dbProduct.name,
        nameHindi: dbProduct.nameHindi,
        slug: dbProduct.slug,
        description: dbProduct.description,
        price: dbProduct.price,
        originalPrice: dbProduct.originalPrice || undefined,
        category: dbProduct.categoryId as ProductCategory,
        categoryData: catData as any,
        image: withImageVersion(dbProduct.image, dbProduct.updatedAt?.getTime?.() ?? null),
        badge: dbProduct.badge || undefined,
        badgeColor: (dbProduct.badgeColor as any) || undefined,
        rating: dbProduct.rating,
        reviewCount: dbProduct.reviewCount,
        isVeg: dbProduct.isVeg,
        isAvailable: dbProduct.isAvailable,
        isFeatured: dbProduct.isFeatured,
        isTodaySpecial: dbProduct.isTodaySpecial,
        weightGrams: dbProduct.weightGrams,
        allergens: dbProduct.allergens,
        ingredients: dbProduct.ingredients || undefined,
        shelfLifeDays: dbProduct.shelfLifeDays,
    };
}

export async function getProductsByCategory(category: ProductCategory): Promise<Product[]> {
    return getProductsByCategoryCached(category);
}

const getProductsByCategoryCached = unstable_cache(
    async (category: ProductCategory): Promise<Product[]> => {
        const whereClause = category === 'all' ? { isAvailable: true } : { categoryId: category, isAvailable: true };
        const products = await prisma.product.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
        });

        return products.map(mapToProductType);
    },
    ['products-by-category'],
    { tags: [CACHE_TAGS.products], revalidate: 120 }
);

export async function getFeaturedProducts(): Promise<Product[]> {
    return getFeaturedProductsCached();
}

const getFeaturedProductsCached = unstable_cache(
    async (): Promise<Product[]> => {
        const products = await prisma.product.findMany({
            where: { isFeatured: true, isAvailable: true },
            orderBy: { createdAt: 'desc' },
        });

        return products.map(mapToProductType);
    },
    ['featured-products'],
    { tags: [CACHE_TAGS.products, CACHE_TAGS.featuredProducts], revalidate: 120 }
);

export async function getTodaySpecials(): Promise<Product[]> {
    return getTodaySpecialsCached();
}

const getTodaySpecialsCached = unstable_cache(
    async (): Promise<Product[]> => {
        const products = await prisma.product.findMany({
            where: { isTodaySpecial: true, isAvailable: true },
            orderBy: { createdAt: 'desc' },
        });

        return products.map(mapToProductType);
    },
    ['today-specials'],
    { tags: [CACHE_TAGS.products, CACHE_TAGS.todaySpecials], revalidate: 120 }
);

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
    return getProductBySlugCached(slug);
}

const getProductBySlugCached = unstable_cache(
    async (slug: string): Promise<Product | undefined> => {
        const product = await prisma.product.findUnique({
            where: { slug },
        });

        return product ? mapToProductType(product) : undefined;
    },
    ['product-by-slug'],
    { tags: [CACHE_TAGS.products], revalidate: 120 }
);

export async function searchProducts(query: string): Promise<Product[]> {
    const q = query.toLowerCase().trim();
    if (!q) {
        const products = await prisma.product.findMany({ where: { isAvailable: true } });
        return products.map(mapToProductType);
    }

    // Prisma full text search requires specific DB setup, so we use contains
    // for a simple string match MVP across name, description, and Hindi name.
    const products = await prisma.product.findMany({
        where: {
            isAvailable: true,
            OR: [
                { name: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } },
                { nameHindi: { contains: q } },
            ],
        },
    });
    return products.map(mapToProductType);
}

export function paginateProducts(
    products: Product[],
    page: number,
    perPage: number = 12
): { items: Product[]; total: number; totalPages: number } {
    const total = products.length;
    const totalPages = Math.ceil(total / perPage);
    const items = products.slice((page - 1) * perPage, page * perPage);
    return { items, total, totalPages };
}

// ─── Categories ───────────────────────────────────────────────
// For UI rendering speed, we still export these statically as they rarely change
// (and are used for the static Carousel).
import type { CategoryMeta } from '@/types';
export const CATEGORIES: CategoryMeta[] = [
    { id: 'all', label: 'All Items', labelHindi: 'सभी मिठाई', emoji: '🍬', description: 'Browse our complete collection', gstRate: 5 },
    { id: 'cashew-sweets', label: 'Cashew Sweets', labelHindi: 'काजू मिठाई', emoji: '🥜', description: 'Premium sweets made with fine cashews.', gstRate: 5 },
    { id: 'ladoo', label: 'Ladoo', labelHindi: 'लड्डू', emoji: '🟡', description: 'Traditional round delights.', gstRate: 5 },
    { id: 'milk-sweets', label: 'Milk Sweets', labelHindi: 'दूध की मिठाई', emoji: '🥛', description: 'Rich fudge and milk-based desserts.', gstRate: 5 },
    { id: 'bengali-sweets', label: 'Bengali Sweets', labelHindi: 'बंगाली मिठाई', emoji: '⚪', description: 'Soft, spongy sweets soaked in syrup.', gstRate: 5 },
    { id: 'hot-fresh', label: 'Hot & Fresh', labelHindi: 'गरमा गरम', emoji: '🔥', description: 'Freshly prepared winter specials and jalebis.', gstRate: 5 },
    { id: 'savories', label: 'Savories', labelHindi: 'नमकीन', emoji: '🥨', description: 'Crispy, salty, and spicy snacks.', gstRate: 5 },
    { id: 'dry-fruits-ghee', label: 'Dry Fruits & Ghee', labelHindi: 'सूखे मेवे', emoji: '🥜', description: 'Flaky sweets rich in ghee and nuts.', gstRate: 5 },
    { id: 'cookies-bakery', label: 'Cookies & Bakery', labelHindi: 'कुकीज़ और बेकरी', emoji: '🍪', description: 'Fresh baked biscuits and rusks.', gstRate: 18 },
];

/**
 * Get categories from database (includes 'all' category)
 */
export async function getCategories(): Promise<CategoryMeta[]> {
    return getCategoriesCached();
}

const getCategoriesCached = unstable_cache(
    async (): Promise<CategoryMeta[]> => {
        try {
            const dbCategories = await prisma.category.findMany({
                orderBy: { label: 'asc' },
            });

            const allCategory: CategoryMeta = {
                id: 'all',
                label: 'All Items',
                labelHindi: 'सभी मिठाई',
                emoji: '🍬',
                description: 'Browse our complete collection',
                gstRate: 5,
            };

            return [allCategory, ...dbCategories as CategoryMeta[]];
        } catch (error) {
            console.error('Failed to fetch categories from DB, falling back to static:', error);
            return CATEGORIES;
        }
    },
    ['categories'],
    { tags: [CACHE_TAGS.categories], revalidate: 300 }
);
