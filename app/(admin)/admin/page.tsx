import { prisma } from '@/lib/prisma';
import { formatCurrency, getUtcRangeForCurrentISTDay } from '@/lib/utils';
import { TrendingUp, Package, Clock } from 'lucide-react';
import { Suspense } from 'react';
import AllTimeStats from './AllTimeStats';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminDashboard() {
    const { start: todayStart, end: todayEnd } = getUtcRangeForCurrentISTDay();

    const [todaysOrders, pendingOrdersCount] = await Promise.all([
        prisma.order.findMany({
            where: {
                createdAt: {
                    gte: todayStart,
                    lte: todayEnd,
                },
                NOT: { status: 'PENDING' },
            },
            select: {
                totalPaise: true,
                status: true,
            },
        }),
        prisma.order.count({
            where: { status: 'PENDING' },
        }),
    ]);

    const todayRevenuePaise = todaysOrders
        .filter((o) => o.status !== 'FAILED')
        .reduce((sum, o) => sum + o.totalPaise, 0);

    const STATS = [
        {
            label: "Today's Revenue",
            value: formatCurrency(todayRevenuePaise / 100),
            icon: TrendingUp,
            color: 'text-green-600',
            bg: 'bg-green-100',
        },
        {
            label: "Today's Orders",
            value: todaysOrders.length.toString(),
            icon: Package,
            color: 'text-saffron-600',
            bg: 'bg-saffron-100',
        },
        {
            label: 'Pending Orders',
            value: pendingOrdersCount.toString(),
            icon: Clock,
            color: 'text-amber-600',
            bg: 'bg-amber-100',
        },
    ];

    return (
        <div className="origin-top scale-[0.95]">
            <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
                <div>
                    <h1 className="font-display font-bold text-3xl text-maroon-900">Dashboard Overview</h1>
                    <p className="text-maroon-500 mt-1">Welcome back. Here&apos;s what&apos;s happening at the store today.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
                    {STATS.map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-cream-200 shadow-warm-sm flex items-start gap-4 min-w-0">
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
                    <Suspense
                        fallback={
                            <>
                                <div className="bg-white p-6 rounded-2xl border border-cream-200 shadow-warm-sm animate-pulse" />
                                <div className="bg-white p-6 rounded-2xl border border-cream-200 shadow-warm-sm animate-pulse" />
                            </>
                        }
                    >
                        <AllTimeStats />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
