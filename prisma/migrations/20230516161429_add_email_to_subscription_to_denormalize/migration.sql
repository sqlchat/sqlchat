-- AlterTable
ALTER TABLE "subscription" ADD COLUMN     "email" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE INDEX "subscription_email_idx" ON "subscription"("email");
