/*
  Warnings:

  - Added the required column `plan` to the `subscription` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('PRO');

-- AlterTable
ALTER TABLE "subscription" ADD COLUMN     "amount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "description" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "email" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "plan" "SubscriptionPlan" NOT NULL,
ADD COLUMN     "receipt" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "usage" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_user" TEXT NOT NULL DEFAULT '',
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "usage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "usage_created_at_idx" ON "usage"("created_at");

-- CreateIndex
CREATE INDEX "usage_end_user_idx" ON "usage"("end_user");

-- CreateIndex
CREATE INDEX "subscription_user_id_idx" ON "subscription"("user_id");

-- CreateIndex
CREATE INDEX "subscription_email_idx" ON "subscription"("email");
