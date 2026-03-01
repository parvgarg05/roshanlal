import { NextResponse } from 'next/server';
import { signAuthToken } from '@/lib/auth';
import { normalizeIpFromHeaders, safeCompareStrings } from '@/lib/admin-auth';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_ATTEMPTS = 5;

type LoginAttemptState = {
    count: number;
    firstAttemptAt: number;
    blockedUntil: number;
};

const loginAttemptsByIp = new Map<string, LoginAttemptState>();

function canAttemptLogin(ip: string) {
    const now = Date.now();
    const current = loginAttemptsByIp.get(ip);

    if (!current) {
        return { allowed: true, retryAfter: 0 };
    }

    if (current.blockedUntil > now) {
        return {
            allowed: false,
            retryAfter: Math.ceil((current.blockedUntil - now) / 1000),
        };
    }

    if (now - current.firstAttemptAt > RATE_LIMIT_WINDOW_MS) {
        loginAttemptsByIp.delete(ip);
        return { allowed: true, retryAfter: 0 };
    }

    return { allowed: true, retryAfter: 0 };
}

function registerFailedLogin(ip: string) {
    const now = Date.now();
    const current = loginAttemptsByIp.get(ip);

    if (!current || now - current.firstAttemptAt > RATE_LIMIT_WINDOW_MS) {
        loginAttemptsByIp.set(ip, {
            count: 1,
            firstAttemptAt: now,
            blockedUntil: 0,
        });
        return;
    }

    const nextCount = current.count + 1;
    if (nextCount >= RATE_LIMIT_MAX_ATTEMPTS) {
        loginAttemptsByIp.set(ip, {
            count: 0,
            firstAttemptAt: now,
            blockedUntil: now + RATE_LIMIT_WINDOW_MS,
        });
        return;
    }

    loginAttemptsByIp.set(ip, {
        ...current,
        count: nextCount,
    });
}

function registerSuccessfulLogin(ip: string) {
    loginAttemptsByIp.delete(ip);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const inputUsername = typeof body?.username === 'string' ? body.username.trim() : '';
        const inputPassword = typeof body?.password === 'string' ? body.password : '';
        const ip = normalizeIpFromHeaders(req.headers);

        const { allowed, retryAfter } = canAttemptLogin(ip);
        if (!allowed) {
            return NextResponse.json(
                { error: 'Too many failed attempts. Please try again later.' },
                {
                    status: 429,
                    headers: {
                        'Retry-After': String(retryAfter),
                    },
                }
            );
        }

        if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
            return NextResponse.json(
                { error: 'Admin login is not configured on the server.' },
                { status: 500 }
            );
        }

        const isUsernameValid = safeCompareStrings(inputUsername, ADMIN_USERNAME);
        const isPasswordValid = safeCompareStrings(inputPassword, ADMIN_PASSWORD);

        if (!isUsernameValid || !isPasswordValid) {
            registerFailedLogin(ip);
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const token = await signAuthToken({ role: 'admin' });
        registerSuccessfulLogin(ip);

        const response = NextResponse.json({ ok: true });
        response.cookies.set('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24,
        });

        return response;
    } catch {
        return NextResponse.json({ error: 'Something went wrong. Try again.' }, { status: 500 });
    }
}
