import { prisma } from '@/lib/prisma';
import { formatCurrency, getUtcRangeForCurrentISTDay } from '@/lib/utils';
import { IndianRupee, TrendingUp, Package, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminDashboard() {
    const { start: todayStart, end: todayEnd } = getUtcRangeForCurrentISTDay();

    // 1. Fetch Today's Orders
    const todaysOrders = await prisma.order.findMany({
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
    });

    const todayRevenuePaise = todaysOrders
        .filter((o) => o.status !== 'FAILED')
        .reduce((sum, o) => sum + o.totalPaise, 0);

    const pendingOrdersCount = await prisma.order.count({
        where: { status: 'PENDING' },
    });

    // 2. Fetch All-Time Revenue + Orders
    const allOrders = await prisma.order.findMany({
        where: { NOT: { status: 'PENDING' } },
        select: { totalPaise: true, status: true },
    });

    const allOrdersCount = await prisma.order.count({
        where: { NOT: { status: 'PENDING' } },
    });

    const allTimeRevenuePaise = allOrders
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
            label: 'All-Time Orders',
            value: allOrdersCount.toString(),
            icon: Package,
            color: 'text-indigo-600',
            bg: 'bg-indigo-100',
        },
        {
            label: 'Pending Orders',
            value: pendingOrdersCount.toString(),
            icon: Clock,
            color: 'text-amber-600',
            bg: 'bg-amber-100',
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
        <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
            <div>
                <h1 className="font-display font-bold text-3xl text-maroon-900">Dashboard Overview</h1>
                <p className="text-maroon-500 mt-1">Welcome back. Here&apos;s what&apos;s happening at the store today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
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
            </div>

            {/* Quick Actions / Info */}
            <div className="bg-cream-100 rounded-2xl p-6 border border-cream-200">
                <h3 className="font-bold text-maroon-900 mb-2">Need to process orders?</h3>
                <p className="text-maroon-600 text-sm mb-4">
                    You have {pendingOrdersCount} orders waiting to be processed or shipped. Head over to the Orders tab to update their status.
                </p>
                <a href="/admin/orders" className="inline-flex items-center justify-center h-10 px-4 rounded-xl bg-maroon-900 text-white text-sm font-medium hover:bg-maroon-800 transition-colors">
                    View Orders
                </a>
            </div>
        </div>
    );
}
