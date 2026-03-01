import { NextRequest, NextResponse } from 'next/server';
import { CreateOrderRequestSchema } from '@/lib/validations/checkout';
import { calculateDeliveryCharge, getDeliveryPricingConfig } from '@/lib/delivery';
import { getRazorpay } from '@/lib/razorpay';
import { prisma } from '@/lib/prisma';
import { formatOrderWindowIST, getOrderTimingConfig, isWithinOrderWindowIST } from '@/lib/orderTiming';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    try {
        const orderTiming = await getOrderTimingConfig();
        const enforceSetting = (process.env.ENFORCE_ORDER_TIMING || '').toLowerCase();
        const shouldEnforceOrderTiming = enforceSetting !== 'false';

        if (shouldEnforceOrderTiming && !isWithinOrderWindowIST(orderTiming)) {
            return NextResponse.json(
                { error: `Sorry, we are receiving orders only between ${formatOrderWindowIST(orderTiming)}.` },
                { status: 403 }
            );
        }

        // 1. Parse & validate request body
        const body = await req.json();
        const parsed = CreateOrderRequestSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Invalid request', details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const { customer, items } = parsed.data;
        const customerPhone = customer.phone.replace(/\D/g, '');
        const customerEmail = customer.email.trim().toLowerCase();

        // 2. Server-side price calculation — NEVER trust client prices
        let subtotal = 0;
        let cgstTotal = 0;
        let sgstTotal = 0;
        let hasFreeDeliveryEligibleItem = false;

        const resolvedItems: Array<{
            productId: string;
            name: string;
            price: number;
            quantity: number;
            weightGrams: number;
            gstRate: number;
            cgstPaise: number;
            sgstPaise: number;
        }> = [];

        for (const { id, quantity } of items) {
            const product = await prisma.product.findUnique({
                where: { id },
                include: { category: { select: { gstRate: true } } } as any
            });
            if (!product || !product.isAvailable) {
                return NextResponse.json(
                    { error: `Product "${id}" not found or unavailable` },
                    { status: 400 }
                );
            }

            const basePrice = product.price; // in Rupees
            const gstRate = (product as any).category.gstRate as number;
            const itemBaseTotalRupees = basePrice * quantity;

            if ((product.badge || '').toLowerCase() === 'free delivery') {
                hasFreeDeliveryEligibleItem = true;
            }

            // Calculate total GST in Paise (1 Rupee = 100 Paise)
            // itemGstTotalPaise = (Rupees * Rate / 100) * 100 = Rupees * Rate
            const itemGstTotalPaise = itemBaseTotalRupees * gstRate;

            // Split into CGST and SGST (ensuring the sum is always itemGstTotalPaise)
            const cgstPaise = Math.floor(itemGstTotalPaise / 2);
            const sgstPaise = itemGstTotalPaise - cgstPaise;

            subtotal += itemBaseTotalRupees;
            cgstTotal += cgstPaise / 100;
            sgstTotal += sgstPaise / 100;

            resolvedItems.push({
                productId: product.id,
                name: product.name,
                price: basePrice, // Store base price in Rupees as per schema
                quantity,
                weightGrams: product.weightGrams,
                gstRate,
                cgstPaise,
                sgstPaise,
            });
        }

        const deliveryConfig = await getDeliveryPricingConfig();
        const deliveryCharge = calculateDeliveryCharge(subtotal, hasFreeDeliveryEligibleItem, deliveryConfig);
        const grandTotal = subtotal + cgstTotal + sgstTotal + deliveryCharge;

        // Razorpay uses paise (100 paise = ₹1)
        const subtotalPaise = Math.round(subtotal * 100);
        const cgstTotalPaise = Math.round(cgstTotal * 100);
        const sgstTotalPaise = Math.round(sgstTotal * 100);
        const deliveryPaise = Math.round(deliveryCharge * 100);
        const totalPaise = Math.round(grandTotal * 100);

        // 3. Create Razorpay order
        const razorpay = getRazorpay();
        const rzpOrder = await razorpay.orders.create({
            amount: totalPaise,
            currency: 'INR',
            receipt: `rl_${Date.now()}`,
            notes: {
                customer_name: customer.name,
                customer_phone: customerPhone,
                customer_email: customerEmail,
            },
        });

        // 4. Create Customer + create Order in DB
        let dbCustomer = await prisma.customer.findFirst({
            where: {
                phone: customerPhone,
                email: customerEmail,
            },
            orderBy: { createdAt: 'asc' },
        });

        if (!dbCustomer) {
            dbCustomer = await prisma.customer.create({
                data: {
                    name: customer.name,
                    phone: customerPhone,
                    email: customerEmail,
                },
            });
        }

        const dbOrder = await prisma.order.create({
            data: {
                razorpayOrderId: rzpOrder.id,
                status: 'PENDING',
                subtotalPaise,
                cgstTotalPaise,
                sgstTotalPaise,
                deliveryPaise,
                totalPaise,
                addressLine: customer.addressLine,
                city: customer.city,
                state: customer.state,
                pincode: customer.pincode,
                customerId: dbCustomer.id,
                items: {
                    create: resolvedItems,
                },
            } as any,
        });

        // 5. Return safe response (never return key_secret)
        return NextResponse.json({
            razorpayOrderId: rzpOrder.id,
            amount: totalPaise,
            currency: 'INR',
            keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            internalOrderId: dbOrder.id,
            subtotal,
            cgstTotal,
            sgstTotal,
            deliveryCharge,
            total: grandTotal,
        });
    } catch (err) {
        console.error('[create-order]', err);

        // If DB is not connected (no DATABASE_URL), surface a clear message
        const message =
            err instanceof Error ? err.message : 'Internal server error';

        return NextResponse.json({ error: message }, { status: 500 });
    }
}
