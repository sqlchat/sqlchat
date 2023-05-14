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
