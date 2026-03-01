import { SignJWT, jwtVerify } from 'jose';

// Secret key for securing JWT tokens (fallback for dev only, must be set in .env.local)
const getJwtSecretKey = () => {
    const secret = process.env.JWT_SECRET || 'roshanlal_super_secret_dev_key_2025_override_this!';
    return new TextEncoder().encode(secret);
};

// ─── Token Verification (Edge Compatible) ──────────────────────────────────
export async function verifyAuthToken(token: string) {
    try {
        const verified = await jwtVerify(token, getJwtSecretKey());
        return verified.payload as { role: string; exp: number };
    } catch (err) {
        return null; // Invalid or expired token
    }
}

// ─── Token Generation (Runs on login) ──────────────────────────────────────
export async function signAuthToken(payload: { role: string }) {
    // Token expires in 24 hours
    const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(getJwtSecretKey());

    return token;
}
