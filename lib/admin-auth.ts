import { timingSafeEqual } from 'crypto';

export function safeCompareStrings(input: string, expected: string): boolean {
    const inputBuffer = Buffer.from(input);
    const expectedBuffer = Buffer.from(expected);

    if (inputBuffer.length !== expectedBuffer.length) {
        return false;
    }

    return timingSafeEqual(inputBuffer, expectedBuffer);
}

export function normalizeIpFromHeaders(headers: Headers): string {
    const forwardedFor = headers.get('x-forwarded-for');
    if (forwardedFor) {
        return forwardedFor.split(',')[0]?.trim() || 'unknown';
    }

    const realIp = headers.get('x-real-ip');
    if (realIp) {
        return realIp.trim();
    }

    return 'unknown';
}
