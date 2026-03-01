-- CreateTable
CREATE TABLE "OrderTiming" (
    "id" INTEGER NOT NULL,
    "startHour" INTEGER NOT NULL DEFAULT 9,
    "endHour" INTEGER NOT NULL DEFAULT 21,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderTiming_pkey" PRIMARY KEY ("id")
);
