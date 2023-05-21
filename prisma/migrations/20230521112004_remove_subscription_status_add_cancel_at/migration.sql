/*
  Warnings:

  - You are about to drop the column `status` on the `subscription` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "subscription" DROP COLUMN "status",
ADD COLUMN     "canceled_at" TIMESTAMP(3);

-- DropEnum
DROP TYPE "SubscriptionStatus";
