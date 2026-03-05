import { PrismaClient } from '@prisma/client';

// Prevent multiple PrismaClient instances during Next.js hot-reload in dev.
// See: https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
    prismaPoolingWarningShown: boolean | undefined;
};

function hasPooledDatabaseUrl(url: string): boolean {
    const normalized = url.toLowerCase();

    return (
        normalized.includes('-pooler.') ||
        normalized.includes('pgbouncer=true') ||
        normalized.includes('pool_mode=transaction') ||
        normalized.includes('prisma-data.net')
    );
}

function warnIfUnpooledInProduction() {
    if (process.env.NODE_ENV !== 'production') return;
    if (globalForPrisma.prismaPoolingWarningShown) return;

    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        console.warn('[prisma] DATABASE_URL is missing. Configure a pooled Postgres URL for production serverless traffic.');
        globalForPrisma.prismaPoolingWarningShown = true;
        return;
    }

    if (!hasPooledDatabaseUrl(databaseUrl)) {
        console.warn(
            '[prisma] DATABASE_URL does not look pooled. In serverless production, use PgBouncer or Prisma Accelerate to avoid connection exhaustion.'
        );
    }

    globalForPrisma.prismaPoolingWarningShown = true;
}

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log:
            process.env.NODE_ENV === 'development'
                ? ['query', 'error', 'warn']
                : ['error'],
    });

warnIfUnpooledInProduction();

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}
