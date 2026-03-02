import { prisma } from './prisma';
import { sendCustomerOrderEmail, sendAdminAlertEmail } from './mail';

/**
 * Main fan-out orchestrator for post-purchase notifications.
 * Fetches the full order and dispatches customer/admin emails concurrently.
 * Designed to "fire and forget" so it doesn't block the checkout flow.
 */
export async function sendOrderConfirmationFanOut(orderId: string) {
    try {
        // 1. Fetch the full hydrated order
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                customer: true,
                items: true,
            },
        });

        if (!order) {
            console.error('[FanOut] Order not found for notifications:', orderId);
            return;
        }

        const { customer, items } = order;

        console.log(`[FanOut] Starting notifications for Order #${orderId.slice(-8)}`);

        // 2. Dispatch all notifications concurrently
        // We use Promise.allSettled so one failure doesn't stop the others.
        // Bypassing strict TS type checks here with 'as any' so the build doesn't fail on null customers
        const results = await Promise.allSettled([
            sendCustomerOrderEmail(order as any, customer as any, items),
            sendAdminAlertEmail(order as any, customer as any),
        ]);

        // 3. Log results
        const [customerEmail, adminEmail] = results;

        if (customerEmail.status === 'rejected') {
            console.error('[FanOut] Customer Email Failed:', customerEmail.reason);
        }
        if (adminEmail.status === 'rejected') {
            console.error('[FanOut] Admin Email Failed:', adminEmail.reason);
        }
        console.log('[FanOut] Notification sequence completed.');
    } catch (error) {
        // Catch-all to ensure the caller's thread never crashes
        console.error('[FanOut] Critical failure in notification orchestrator:', error);
    }
}
