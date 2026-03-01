import { z } from 'zod';

// ─── Shared Address Schema ─────────────────────────────────────
const AddressSchema = z.object({
    addressLine: z
        .string()
        .min(10, 'Address must be at least 10 characters')
        .max(200, 'Address too long'),
    city: z
        .string()
        .min(2, 'City name required')
        .max(50, 'City name too long'),
    state: z
        .string()
        .min(2, 'State required')
        .max(50, 'State name too long'),
    pincode: z
        .string()
        .regex(/^[1-9][0-9]{5}$/, 'Enter a valid 6-digit Indian pincode'),
});

// ─── Checkout Form (client-side validation) ────────────────────
export const CheckoutFormSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, 'Full name must be at least 2 characters')
        .max(80, 'Name too long')
        .regex(/^[a-zA-Z\s'.]+$/, 'Name may only contain letters and spaces'),
    phone: z
        .string()
        .transform((value) => value.replace(/\D/g, ''))
        .pipe(
            z
                .string()
                .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number')
        ),
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email('Enter a valid email address')
        .max(120, 'Email too long'),
    ...AddressSchema.shape,
});

export type CheckoutFormValues = z.infer<typeof CheckoutFormSchema>;

// ─── Create Order API Request (server-side validation) ─────────
export const CreateOrderRequestSchema = z.object({
    customer: CheckoutFormSchema,
    items: z
        .array(
            z.object({
                id: z.string().min(1, 'Product ID required'),
                quantity: z
                    .number()
                    .int()
                    .min(1, 'Quantity must be at least 1')
                    .max(50, 'Maximum 50 units per item'),
            })
        )
        .min(1, 'Cart cannot be empty'),
});

export type CreateOrderRequest = z.infer<typeof CreateOrderRequestSchema>;
