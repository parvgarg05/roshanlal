// Shared TypeScript types for L.Roshanlal Ji Sweets

export interface Product {
    id: string;
    name: string;
    nameHindi: string;
    slug: string;
    description: string;
    price: number;
    originalPrice?: number;
    category: ProductCategory;
    image: string;
    badge?: string;
    badgeColor?: 'saffron' | 'gold' | 'maroon' | 'green';
    rating: number;
    reviewCount: number;
    isVeg: boolean;
    isAvailable: boolean;
    isFeatured: boolean;
    isTodaySpecial: boolean;
    weightGrams: number;
    allergens?: string[];
    ingredients?: string;
    shelfLifeDays: number;
    categoryData?: CategoryMeta;
}

export type ProductCategory =
    | 'all'
    | 'cashew-sweets'
    | 'ladoo'
    | 'milk-sweets'
    | 'bengali-sweets'
    | 'hot-fresh'
    | 'savories'
    | 'dry-fruits-ghee'
    | 'cookies-bakery';

export interface CategoryMeta {
    id: ProductCategory;
    label: string;
    labelHindi: string;
    emoji: string;
    description: string;
    gstRate: number;
}

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    weightGrams: number;
    gstRate: number;
    isFreeDeliveryEligible?: boolean;
}

export interface PaginationMeta {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
}

// Order Types for Frontend Usage
export type OrderStatus =
    | 'PENDING'
    | 'PAID'
    | 'FAILED'
    | 'REFUNDED'
    | 'PROCESSING'
    | 'DELIVERED';

export interface Order {
    id: string;
    razorpayOrderId: string;
    razorpayPaymentId?: string | null;
    status: OrderStatus;
    subtotalPaise: number;
    cgstTotalPaise: number;
    sgstTotalPaise: number;
    deliveryPaise: number;
    totalPaise: number;
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
    customerId: string;
    createdAt: string | Date;
}
