-- CreateEnum
CREATE TYPE "PrincipalType" AS ENUM ('END_USER', 'BOT');

-- CreateEnum
CREATE TYPE "PrincipalStatus" AS ENUM ('ACTIVE', 'BLOCKED');

-- CreateTable
CREATE TABLE "principal" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "PrincipalType" NOT NULL DEFAULT 'END_USER',
    "status" "PrincipalStatus" NOT NULL DEFAULT 'ACTIVE',
    "resource_id" TEXT NOT NULL DEFAULT '',
    "name" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "password_hash" TEXT NOT NULL DEFAULT '',
    "avatar" BYTEA,

    CONSTRAINT "principal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "principal_resource_id_key" ON "principal"("resource_id");

-- CreateIndex
CREATE UNIQUE INDEX "principal_email_key" ON "principal"("email");

-- CreateIndex
CREATE INDEX "principal_name_idx" ON "principal"("name");
