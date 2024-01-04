-- CreateTable
CREATE TABLE "sample_sql" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "query" TEXT NOT NULL,
    "table" TEXT NOT NULL,
    "sql" TEXT NOT NULL,

    CONSTRAINT "sample_sql_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "chat_sql_idx" ON "sample_sql"("sql");
