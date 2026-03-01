import { calculateDeliveryCharge } from './delivery';

const INDIA_TIME_ZONE = 'Asia/Kolkata';

// Shared utility helpers

/**
 * Format a number as Indian Rupees.
 */
export function formatCurrency(amount: number): string {
    const hasFraction = amount % 1 !== 0;
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: hasFraction ? 2 : 0,
        maximumFractionDigits: hasFraction ? 2 : 0,
    }).format(amount);
}

/**
 * Calculate delivery charge using current pricing rules.
 */
export function getDeliveryCharge(subtotal: number, hasFreeDeliveryEligibleItem: boolean = false): number {
    return calculateDeliveryCharge(subtotal, hasFreeDeliveryEligibleItem);
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

/**
 * Slugify a string.
 */
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();
}

/**
 * Truncate a string to a max length.
 */
export function truncate(text: string, max: number): string {
    return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
}

/**
 * Returns true when URL is explicitly HTTP (not HTTPS).
 */
export function isHttpImageUrl(value: string): boolean {
    return /^http:\/\//i.test(value.trim());
}

/**
 * Add/replace a version query param to bust stale image caches.
 */
export function withImageVersion(imageUrl: string, version?: string | number | null): string {
    const cleanUrl = imageUrl.trim();
    if (!cleanUrl || version === undefined || version === null) {
        return cleanUrl;
    }

    const [base, hash = ''] = cleanUrl.split('#');
    const encodedVersion = encodeURIComponent(String(version));

    const versionPattern = /([?&])v=[^&]*/i;
    const nextBase = versionPattern.test(base)
        ? base.replace(versionPattern, `$1v=${encodedVersion}`)
        : `${base}${base.includes('?') ? '&' : '?'}v=${encodedVersion}`;

    return hash ? `${nextBase}#${hash}` : nextBase;
}

/**
 * Format a date in India Standard Time.
 */
export function formatDateTimeIST(
    date: Date,
    options: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    }
): string {
    return new Intl.DateTimeFormat('en-IN', {
        timeZone: INDIA_TIME_ZONE,
        ...options,
    }).format(date);
}

function getTimeZoneOffsetMs(date: Date, timeZone: string): number {
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    }).formatToParts(date);

    const year = Number(parts.find((part) => part.type === 'year')?.value);
    const month = Number(parts.find((part) => part.type === 'month')?.value);
    const day = Number(parts.find((part) => part.type === 'day')?.value);
    const hour = Number(parts.find((part) => part.type === 'hour')?.value);
    const minute = Number(parts.find((part) => part.type === 'minute')?.value);
    const second = Number(parts.find((part) => part.type === 'second')?.value);

    const asUtcMs = Date.UTC(year, month - 1, day, hour, minute, second);
    return asUtcMs - date.getTime();
}

/**
 * Returns UTC boundaries for the current calendar day in IST.
 */
export function getUtcRangeForCurrentISTDay(referenceDate: Date = new Date()): { start: Date; end: Date } {
    const dateParts = new Intl.DateTimeFormat('en-US', {
        timeZone: INDIA_TIME_ZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(referenceDate);

    const year = Number(dateParts.find((part) => part.type === 'year')?.value);
    const month = Number(dateParts.find((part) => part.type === 'month')?.value);
    const day = Number(dateParts.find((part) => part.type === 'day')?.value);

    const istMidnightAsUtcMs = Date.UTC(year, month - 1, day, 0, 0, 0, 0);
    const istNextMidnightAsUtcMs = Date.UTC(year, month - 1, day + 1, 0, 0, 0, 0);

    const startOffset = getTimeZoneOffsetMs(new Date(istMidnightAsUtcMs), INDIA_TIME_ZONE);
    const nextStartOffset = getTimeZoneOffsetMs(new Date(istNextMidnightAsUtcMs), INDIA_TIME_ZONE);

    const start = new Date(istMidnightAsUtcMs - startOffset);
    const nextStart = new Date(istNextMidnightAsUtcMs - nextStartOffset);
    const end = new Date(nextStart.getTime() - 1);

    return { start, end };
}
