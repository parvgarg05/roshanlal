import { prisma } from './prisma';

export interface DeliveryPricingConfig {
    freeDeliveryThreshold: number;
    reducedDeliveryThreshold: number;
    reducedDeliveryFee: number;
    baseDeliveryFee: number;
}

export const DEFAULT_DELIVERY_PRICING: DeliveryPricingConfig = {
    freeDeliveryThreshold: 499,
    reducedDeliveryThreshold: 299,
    reducedDeliveryFee: 30,
    baseDeliveryFee: 50,
};

export function calculateDeliveryCharge(
    subtotal: number,
    hasFreeDeliveryEligibleItem: boolean,
    config: DeliveryPricingConfig = DEFAULT_DELIVERY_PRICING
): number {
    if (hasFreeDeliveryEligibleItem) return 0;
    if (subtotal >= config.freeDeliveryThreshold) return 0;
    if (subtotal >= config.reducedDeliveryThreshold) return config.reducedDeliveryFee;
    return config.baseDeliveryFee;
}

export async function getDeliveryPricingConfig(): Promise<DeliveryPricingConfig> {
    try {
        const config = await (prisma as any).deliveryPricing.findUnique({
            where: { id: 1 },
        });

        if (!config) {
            return DEFAULT_DELIVERY_PRICING;
        }

        return {
            freeDeliveryThreshold: config.freeDeliveryThreshold,
            reducedDeliveryThreshold: config.reducedDeliveryThreshold,
            reducedDeliveryFee: config.reducedDeliveryFee,
            baseDeliveryFee: config.baseDeliveryFee,
        };
    } catch {
        return DEFAULT_DELIVERY_PRICING;
    }
}