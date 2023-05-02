/*
  Warnings:

  - Added the required column `model` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "model" JSONB NOT NULL;
