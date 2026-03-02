import { prisma } from '@/lib/prisma';
import { formatCurrency, formatDateTimeIST } from '@/lib/utils';
import { OrderStatus } from '@prisma/client';
import StatusSelect from './StatusSelect';

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
    if (tab === 'processing') return [OrderStatus.PROCESSING];
    if (tab === 'pending-payment') return [OrderStatus.PENDING, OrderStatus.FAILED];
    if (tab === 'delivered') return [OrderStatus.DELIVERED];

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

    const istStart = new Date(Date.UTC(
        istDate.getUTCFullYear(),
        istDate.getUTCMonth(),
        istDate.getUTCDate(),
        0, 0, 0, 0
    ));

    const istEnd = new Date(Date.UTC(
        istDate.getUTCFullYear(),
        istDate.getUTCMonth(),
        istDate.getUTCDate(),
        23, 59, 59, 999
    ));

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
    const requestedTab = Array.isArray(resolvedSearchParams.tab)
        ? resolvedSearchParams.tab[0]
        : resolvedSearchParams.tab;

    const selectedDateInput = Array.isArray(resolvedSearchParams.date)
        ? resolvedSearchParams.date[0]
        : resolvedSearchParams.date;

    const activeTab: AdminOrderTab = ADMIN_ORDER_TABS.some(
        (tab) => tab.key === requestedTab
    )
        ? (requestedTab as AdminOrderTab)
        : 'all';

    const statusFilter = getStatusFilterForTab(activeTab);
    const { startUtc, endUtc } = getIstDayRange(new Date());
    const parsedSelectedDate = parseIstDateInputToUtcRange(selectedDateInput);

    const createdAtFilter:
        | { gte?: Date; lte?: Date; lt?: Date }
        | undefined =
        activeTab === 'today'
            ? { gte: startUtc, lte: endUtc }
            : activeTab === 'past'
            ? parsedSelectedDate
                ? { gte: parsedSelectedDate.startUtc, lte: parsedSelectedDate.endUtc }
                : { lt: startUtc }
            : undefined;

    const orders = await prisma.order.findMany({
        where: {
            status: { in: statusFilter },
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
            <h1 className="font-display font-bold text-3xl text-maroon-900">
                Orders
            </h1>

            <div className="bg-white rounded-2xl border border-cream-200 shadow-warm-sm overflow-x-auto">
                {orders.length === 0 ? (
                    <div className="p-12 text-center text-maroon-400">
                        No orders found.
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
                                <tr key={order.id}>
                                    {/* Order Details */}
                                    <td className="px-5 py-4 align-top">
                                        <div className="font-mono text-sm text-maroon-400 mb-1">
                                            #{order.id.slice(-8).toUpperCase()}
                                        </div>
                                        <div className="text-maroon-900 font-medium mb-2">
                                            {formatDateTimeIST(order.createdAt)}
                                        </div>
                                    </td>

                                    {/* Customer */}
                                    <td className="px-5 py-4 align-top">
                                        {order.customer ? (
                                            <>
                                                <div className="text-maroon-900 font-medium">
                                                    {order.customer.name}
                                                </div>
                                                <div className="text-maroon-500 text-sm mt-0.5">
                                                    {order.customer.phone}
                                                </div>
                                                <div className="text-maroon-500 text-sm truncate max-w-[150px]">
                                                    {order.customer.email}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-gray-400 italic">
                                                Guest Order
                                            </div>
                                        )}
                                    </td>

                                    {/* Address */}
                                    <td className="px-5 py-4 align-top">
                                        {order.addressLine}, {order.city},{' '}
                                        {order.state} {order.pincode}
                                    </td>

                                    {/* Total */}
                                    <td className="px-5 py-4 align-top text-right font-bold">
                                        {formatCurrency(order.totalPaise / 100)}
                                    </td>

                                    {/* Status */}
                                    <td className="px-5 py-4 align-top text-center">
                                        <StatusSelect
                                            orderId={order.id}
                                            currentStatus={order.status}
                                        />
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
