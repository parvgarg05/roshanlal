import { IndianRupee, Package } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { formatCurrency } from '@/lib/utils';

export default async function AllTimeStats() {
    const [allOrders, allOrdersCount] = await Promise.all([
        prisma.order.findMany({
            where: { NOT: { status: 'PENDING' } },
            select: { totalPaise: true, status: true },
        }),
        prisma.order.count({
            where: {
                status: {
                    in: ['PAID', 'PROCESSING', 'DELIVERED', 'REFUNDED'],
                },
            },
        }),
    ]);

    const allTimeRevenuePaise = allOrders
        .filter((order) => order.status !== 'FAILED')
        .reduce((sum, order) => sum + order.totalPaise, 0);

    const stats = [
        {
            label: 'All-Time Orders',
            value: allOrdersCount.toString(),
            icon: Package,
            color: 'text-indigo-600',
            bg: 'bg-indigo-100',
        },
        {
            label: 'All-Time Revenue',
            value: formatCurrency(allTimeRevenuePaise / 100),
            icon: IndianRupee,
            color: 'text-maroon-600',
            bg: 'bg-maroon-100',
        },
    ];

    return (
        <>
            {stats.map((stat) => (
                <div key={stat.label} className="bg-white p-6 rounded-2xl border border-cream-200 shadow-warm-sm flex items-start gap-4 min-w-0">
                    <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} shrink-0`}>
                        <stat.icon size={24} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-maroon-500 mb-1">{stat.label}</p>
                        <h3 className="font-display font-bold text-xl md:text-2xl leading-tight text-maroon-900 break-words">
                            {stat.value}
                        </h3>
                    </div>
                </div>
            ))}
        </>
    );
}
