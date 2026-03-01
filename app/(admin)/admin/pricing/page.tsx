import { getDeliveryPricingConfig } from '@/lib/delivery';
import PricingForm from './PricingForm';

export default async function AdminPricingPage() {
    const config = await getDeliveryPricingConfig();

    return (
        <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="font-display font-bold text-3xl text-maroon-900">Pricing Settings</h1>
                <p className="text-maroon-500 mt-1">Set real delivery fees used across cart, checkout, and order creation.</p>
            </div>

            <div className="bg-white rounded-2xl border border-cream-200 shadow-warm-sm p-5 md:p-6">
                <PricingForm initialValues={config} />
            </div>
        </div>
    );
}
