-- CreateEnum
CREATE TYPE "PrincipalType" AS ENUM ('END_USER', 'BOT');

-- CreateEnum
CREATE TYPE "PrincipalStatus" AS ENUM ('ACTIVE', 'BLOCKED');

-- CreateTable
CREATE TABLE "Principal" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "PrincipalType" NOT NULL DEFAULT 'END_USER',
    "status" "PrincipalStatus" NOT NULL DEFAULT 'ACTIVE',
    "name" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "password_hash" TEXT NOT NULL,
    "avatar" BYTEA,

    CONSTRAINT "Principal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Principal_name_key" ON "Principal"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Principal_email_key" ON "Principal"("email");

-- CreateIndex
CREATE INDEX "Principal_name_idx" ON "Principal"("name");
