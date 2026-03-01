'use client';

import { useTransition } from 'react';
import { updateOrderStatus } from './actions';
import { OrderStatus } from '@prisma/client';

export default function StatusSelect({ orderId, currentStatus }: { orderId: string, currentStatus: OrderStatus }) {
    const [isPending, startTransition] = useTransition();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as OrderStatus;
        startTransition(async () => {
            await updateOrderStatus(orderId, newStatus);
        });
    };

    const colors: Record<OrderStatus, string> = {
        PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
        PROCESSING: 'bg-blue-100 text-blue-800 border-blue-200',
        PAID: 'bg-green-100 text-green-800 border-green-200',
        DELIVERED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        FAILED: 'bg-red-100 text-red-800 border-red-200',
        REFUNDED: 'bg-gray-100 text-gray-800 border-gray-200',
    };

    return (
        <select
            value={currentStatus}
            onChange={handleChange}
            disabled={isPending}
            className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border focus:ring-2 focus:ring-offset-1 focus:ring-maroon-300 outline-none transition-colors disabled:opacity-50
                ${colors[currentStatus]}
            `}
        >
            {Object.values(OrderStatus).map((status) => (
                <option key={status} value={status}>
                    {status}
                </option>
            ))}
        </select>
    );
}
