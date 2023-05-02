/*
  Warnings:

  - You are about to drop the column `invoice` on the `subscription` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[payment_id]` on the table `subscription` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[invoice_id]` on the table `subscription` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "subscription" DROP COLUMN "invoice",
ADD COLUMN     "invoice_id" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "payment_id" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "subscription_payment_id_key" ON "subscription"("payment_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_invoice_id_key" ON "subscription"("invoice_id");
