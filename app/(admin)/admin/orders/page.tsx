import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatCurrency, formatDateTimeIST } from '@/lib/utils';
import { OrderStatus } from '@prisma/client';
import StatusSelect from './StatusSelect';
import PastOrdersDateFilter from './PastOrdersDateFilter';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type OrdersPageProps = {
    searchParams: Promise<{ tab?: string | string[]; date?: string | string[] }>;
};

const ADMIN_ORDER_TABS = [
    { key: 'all', label: 'All' },
    { key: 'today', label: "Today's Orders" },
    { key: 'processing', label: 'Processing' },
    { key: 'pending-payment', label: 'Pending Payment' },
    { key: 'delivered', label: 'Delivered' },
    { key: 'past', label: 'Past Orders' },
] as const;

type AdminOrderTab = (typeof ADMIN_ORDER_TABS)[number]['key'];

function getStatusFilterForTab(tab: AdminOrderTab): OrderStatus[] {
    if (tab === 'processing') {
        return [OrderStatus.PROCESSING];
    }

    if (tab === 'pending-payment') {
        return [OrderStatus.PENDING, OrderStatus.FAILED];
    }

    if (tab === 'delivered') {
        return [OrderStatus.DELIVERED];
    }

    return [
        OrderStatus.PENDING,
        OrderStatus.PAID,
        OrderStatus.PROCESSING,
        OrderStatus.DELIVERED,
        OrderStatus.FAILED,
        OrderStatus.REFUNDED,
    ];
}

function getIstDayRange(referenceDate: Date) {
    const IST_OFFSET_MINUTES = 330;
    const utcMs = referenceDate.getTime() + referenceDate.getTimezoneOffset() * 60_000;
    const istDate = new Date(utcMs + IST_OFFSET_MINUTES * 60_000);

    const istStart = new Date(Date.UTC(istDate.getUTCFullYear(), istDate.getUTCMonth(), istDate.getUTCDate(), 0, 0, 0, 0));
    const istEnd = new Date(Date.UTC(istDate.getUTCFullYear(), istDate.getUTCMonth(), istDate.getUTCDate(), 23, 59, 59, 999));

    return {
        startUtc: new Date(istStart.getTime() - IST_OFFSET_MINUTES * 60_000),
        endUtc: new Date(istEnd.getTime() - IST_OFFSET_MINUTES * 60_000),
    };
}

function parseIstDateInputToUtcRange(dateInput?: string) {
    if (!dateInput || !/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) return null;

    const startUtc = new Date(`${dateInput}T00:00:00+05:30`);
    const endUtc = new Date(`${dateInput}T23:59:59.999+05:30`);

    if (Number.isNaN(startUtc.getTime()) || Number.isNaN(endUtc.getTime())) {
        return null;
    }

    return { startUtc, endUtc };
}

function getIstDateInputString(referenceDate: Date) {
    const IST_OFFSET_MINUTES = 330;
    const utcMs = referenceDate.getTime() + referenceDate.getTimezoneOffset() * 60_000;
    const istDate = new Date(utcMs + IST_OFFSET_MINUTES * 60_000);

    const year = istDate.getUTCFullYear();
    const month = String(istDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(istDate.getUTCDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
    const resolvedSearchParams = await searchParams;
    const requestedTab = Array.isArray(resolvedSearchParams.tab) ? resolvedSearchParams.tab[0] : resolvedSearchParams.tab;
    const selectedDateInput = Array.isArray(resolvedSearchParams.date) ? resolvedSearchParams.date[0] : resolvedSearchParams.date;
    const activeTab: AdminOrderTab = ADMIN_ORDER_TABS.some((tab) => tab.key === requestedTab)
        ? (requestedTab as AdminOrderTab)
        : 'all';

    const statusFilter = getStatusFilterForTab(activeTab);
    const { startUtc, endUtc } = getIstDayRange(new Date());
    const todayIstInput = getIstDateInputString(new Date());
    const parsedSelectedDate = parseIstDateInputToUtcRange(selectedDateInput);

    const createdAtFilter: { gte?: Date; lte?: Date; lt?: Date } | undefined =
        activeTab === 'today'
            ? { gte: startUtc, lte: endUtc }
            : activeTab === 'past'
                ? parsedSelectedDate
                    ? { gte: parsedSelectedDate.startUtc, lte: parsedSelectedDate.endUtc }
                    : { lt: startUtc }
                : undefined;

    // Fetch filtered orders with customer and items
    const orders = await prisma.order.findMany({
        where: {
            status: {
                in: statusFilter,
            },
            ...(createdAtFilter ? { createdAt: createdAtFilter } : {}),
        },
        orderBy: { createdAt: 'desc' },
        include: {
            customer: true,
            items: true,
        },
    });

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-display font-bold text-3xl text-maroon-900">Orders</h1>
                    <p className="text-maroon-500 mt-1">Manage all incoming orders and update their fulfillment status.</p>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {ADMIN_ORDER_TABS.map((tab) => {
                    const isActive = activeTab === tab.key;

                    return (
                        <Link
                            key={tab.key}
                            href={`/admin/orders?tab=${tab.key}`}
                            className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                                isActive
                                    ? 'bg-saffron-100 text-saffron-700 border-saffron-300'
                                    : 'bg-white text-maroon-600 border-cream-200 hover:bg-cream-50'
                            }`}
                        >
                            {tab.label}
                        </Link>
                    );
                })}
            </div>

            {activeTab === 'past' && (
                <PastOrdersDateFilter
                    selectedDate={parsedSelectedDate ? selectedDateInput ?? '' : ''}
                    maxDate={todayIstInput}
                />
            )}

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-cream-200 shadow-warm-sm overflow-hidden auto-cols-auto overflow-x-auto">
                {orders.length === 0 ? (
                    <div className="p-12 text-center text-maroon-400">
                        <p>No orders found for this category.</p>
                    </div>
                ) : (
                    <table className="w-full text-left text-[15px] whitespace-nowrap">
                        <thead className="bg-cream-50 text-maroon-500 font-semibold border-b border-cream-200">
                            <tr>
                                <th className="px-5 py-4">Order Details</th>
                                <th className="px-5 py-4">Customer</th>
                                <th className="px-5 py-4">Address</th>
                                <th className="px-5 py-4 text-right">Total</th>
                                <th className="px-5 py-4 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-cream-100">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-cream-50/50 transition-colors">
                                    {/* Order Details */}
                                    <td className="px-5 py-4 align-top">
                                        <div className="font-mono text-sm text-maroon-400 mb-1">
                                            #{order.id.slice(-8).toUpperCase()}
                                        </div>
                                        <div className="text-maroon-900 font-medium mb-2">
                                            {formatDateTimeIST(order.createdAt)}
                                        </div>
                                        <ul className="text-sm text-maroon-600 space-y-1 max-w-[200px] truncate">
                                            {order.items.map(item => (
                                                <li key={item.id} className="truncate">
                                                    {item.quantity}x {item.name}
                                                </li>
                                            ))}
                                        </ul>
                                    </td>

                                    {/* Customer */}
                                    <td className="px-5 py-4 align-top">
                                        <div className="text-maroon-900 font-medium">{order.customer.name}</div>
                                        <div className="text-maroon-500 text-sm mt-0.5">{order.customer.phone}</div>
                                        <div className="text-maroon-500 text-sm truncate max-w-[150px]">{order.customer.email}</div>
                                    </td>

                                    {/* Address */}
                                    <td className="px-5 py-4 align-top max-w-[200px]">
                                        <div className="text-maroon-700 text-sm whitespace-normal line-clamp-2 leading-relaxed">
                                            {order.addressLine}, {order.city}, {order.state} {order.pincode}
                                        </div>
                                    </td>

                                    {/* Total */}
                                    <td className="px-5 py-4 align-top text-right">
                                        <div className="text-maroon-900 font-bold">
                                            {formatCurrency(order.totalPaise / 100)}
                                        </div>
                                        {order.razorpayPaymentId && (
                                            <div className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded uppercase font-semibold inline-block mt-1">
                                                Paid online
                                            </div>
                                        )}
                                    </td>

                                    {/* Status Column */}
                                    <td className="px-5 py-4 align-top text-center">
                                        <StatusSelect orderId={order.id} currentStatus={order.status} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
