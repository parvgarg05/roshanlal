import { prisma } from './prisma';

const INDIA_TIME_ZONE = 'Asia/Kolkata';

export interface OrderTimingConfig {
    startHour: number;
    endHour: number;
}

export const DEFAULT_ORDER_TIMING: OrderTimingConfig = {
    startHour: 9,
    endHour: 21,
};

let orderTimingTableEnsured = false;

function normalizeHour(value: number, fallback: number): number {
    if (!Number.isFinite(value)) return fallback;
    const hour = Math.floor(value);
    if (hour < 0) return 0;
    if (hour > 23) return 23;
    return hour;
}

function normalizeEndHour(value: number, fallback: number): number {
    if (!Number.isFinite(value)) return fallback;
    const hour = Math.floor(value);
    if (hour < 0) return 0;
    if (hour > 24) return 24;
    return hour;
}

async function ensureOrderTimingTable(): Promise<void> {
    if (orderTimingTableEnsured) return;

    await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "OrderTiming" (
            "id" INTEGER NOT NULL,
            "startHour" INTEGER NOT NULL DEFAULT 9,
            "endHour" INTEGER NOT NULL DEFAULT 21,
            "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "OrderTiming_pkey" PRIMARY KEY ("id")
        )
    `);

    orderTimingTableEnsured = true;
}

function normalizeConfig(config: OrderTimingConfig): OrderTimingConfig {
    const startHour = normalizeHour(config.startHour, DEFAULT_ORDER_TIMING.startHour);
    let endHour = normalizeEndHour(config.endHour, DEFAULT_ORDER_TIMING.endHour);

    if (endHour === 0 && startHour > 0) {
        endHour = 24;
    }

    if (startHour === endHour) return DEFAULT_ORDER_TIMING;

    return { startHour, endHour };
}

export async function getOrderTimingConfig(): Promise<OrderTimingConfig> {
    try {
        await ensureOrderTimingTable();

        const rows = await prisma.$queryRaw<Array<{ startHour: number; endHour: number }>>`
            SELECT "startHour", "endHour"
            FROM "OrderTiming"
            WHERE "id" = 1
            LIMIT 1
        `;

        if (!rows.length) return DEFAULT_ORDER_TIMING;

        return normalizeConfig(rows[0]);
    } catch {
        return DEFAULT_ORDER_TIMING;
    }
}

export async function setOrderTimingConfig(config: OrderTimingConfig): Promise<void> {
    const normalized = normalizeConfig(config);
    await ensureOrderTimingTable();

    await prisma.$executeRaw`
        INSERT INTO "OrderTiming" ("id", "startHour", "endHour", "updatedAt")
        VALUES (1, ${normalized.startHour}, ${normalized.endHour}, NOW())
        ON CONFLICT ("id")
        DO UPDATE SET
            "startHour" = EXCLUDED."startHour",
            "endHour" = EXCLUDED."endHour",
            "updatedAt" = NOW()
    `;
}

export function isWithinOrderWindowIST(config: OrderTimingConfig, referenceDate: Date = new Date()): boolean {
    const hourInIST = Number(
        new Intl.DateTimeFormat('en-US', {
            timeZone: INDIA_TIME_ZONE,
            hour: '2-digit',
            hour12: false,
        }).format(referenceDate)
    );

    if (config.startHour < config.endHour) {
        return hourInIST >= config.startHour && hourInIST < config.endHour;
    }

    return hourInIST >= config.startHour || hourInIST < config.endHour;
}

function formatHourLabel(hour: number): string {
    const normalizedHour = ((hour % 24) + 24) % 24;
    const hour12 = normalizedHour % 12 === 0 ? 12 : normalizedHour % 12;
    const period = normalizedHour >= 12 ? 'PM' : 'AM';
    return `${hour12}:00 ${period}`;
}

export function formatOrderWindowIST(config: OrderTimingConfig): string {
    return `${formatHourLabel(config.startHour)} to ${formatHourLabel(config.endHour)} (IST)`;
}
