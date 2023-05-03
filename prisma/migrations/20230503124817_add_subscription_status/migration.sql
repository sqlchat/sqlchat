-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELED');

-- AlterTable
ALTER TABLE "subscription" ADD COLUMN     "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
ALTER COLUMN "user_id" SET DEFAULT '',
ALTER COLUMN "expire_at" SET DEFAULT CURRENT_TIMESTAMP;
