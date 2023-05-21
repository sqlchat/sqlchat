/*
  Warnings:

  - You are about to drop the column `amount` on the `subscription` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `subscription` table. All the data in the column will be lost.
  - You are about to drop the column `customer_id` on the `subscription` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `subscription` table. All the data in the column will be lost.
  - You are about to drop the column `payment_id` on the `subscription` table. All the data in the column will be lost.
  - You are about to drop the column `receipt` on the `subscription` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "subscription_payment_id_key";

-- AlterTable
ALTER TABLE "subscription" DROP COLUMN "amount",
DROP COLUMN "currency",
DROP COLUMN "customer_id",
DROP COLUMN "description",
DROP COLUMN "payment_id",
DROP COLUMN "receipt";

-- CreateTable
CREATE TABLE "payment" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payment_id" TEXT NOT NULL DEFAULT '',
    "customer_id" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "amount" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT '',
    "receipt" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "payment_user_id_idx" ON "payment"("user_id");

-- CreateIndex
CREATE INDEX "payment_email_idx" ON "payment"("email");

-- CreateIndex
CREATE UNIQUE INDEX "payment_payment_id_key" ON "payment"("payment_id");

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
