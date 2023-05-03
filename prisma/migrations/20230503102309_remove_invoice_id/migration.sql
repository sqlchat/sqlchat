/*
  Warnings:

  - You are about to drop the column `invoice_id` on the `subscription` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "subscription_invoice_id_key";

-- AlterTable
ALTER TABLE "subscription" DROP COLUMN "invoice_id";
