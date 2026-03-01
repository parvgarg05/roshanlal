/*
  Warnings:

  - You are about to drop the `CustomerOtp` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email,phone]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_customerId_fkey";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "customerId" DROP NOT NULL;

-- DropTable
DROP TABLE "CustomerOtp";

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_phone_key" ON "Customer"("email", "phone");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
