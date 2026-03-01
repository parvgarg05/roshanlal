import { z } from 'zod';

export const TrackOrdersSchema = z.object({
    phone: z
        .string()
        .transform((value) => {
            const digitsOnly = value.replace(/\D/g, '');
            if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
                return digitsOnly.slice(2);
            }
            return digitsOnly.length > 10 ? digitsOnly.slice(-10) : digitsOnly;
        })
        .refine((value) => /^[6-9]\d{9}$/.test(value), 'Enter a valid 10-digit Indian mobile number'),
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email('Enter a valid email address')
        .max(120, 'Email too long'),
});

export type TrackOrdersRequest = z.infer<typeof TrackOrdersSchema>;
