-- CreateTable
CREATE TABLE "chat" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "model" JSONB NOT NULL DEFAULT '{}',
    "ctx" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message" (
    "id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_user" TEXT NOT NULL DEFAULT '',
    "role" TEXT NOT NULL DEFAULT '',
    "content" TEXT NOT NULL DEFAULT '',
    "upvote" BOOLEAN NOT NULL DEFAULT false,
    "downvote" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "chat_created_at_idx" ON "chat"("created_at");

-- CreateIndex
CREATE INDEX "message_chat_id_idx" ON "message"("chat_id");

-- CreateIndex
CREATE INDEX "message_created_at_idx" ON "message"("created_at");

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
