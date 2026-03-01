import { getOrderTimingConfig } from '@/lib/orderTiming';
import TimingForm from './TimingForm';

export default async function AdminTimingPage() {
    const config = await getOrderTimingConfig();

    return (
        <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="font-display font-bold text-3xl text-maroon-900">Order Timing</h1>
                <p className="text-maroon-500 mt-1">Set the order receiving window for customers in IST.</p>
            </div>

            <div className="bg-white rounded-2xl border border-cream-200 shadow-warm-sm p-5 md:p-6">
                <TimingForm initialValues={config} />
            </div>
        </div>
    );
}
