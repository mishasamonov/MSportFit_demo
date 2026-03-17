/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Exercise` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN     "alternatives" JSONB,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "mistakes" JSONB,
ADD COLUMN     "slug" TEXT,
ADD COLUMN     "steps" JSONB,
ADD COLUMN     "tips" JSONB;

-- CreateIndex
CREATE UNIQUE INDEX "Exercise_slug_key" ON "Exercise"("slug");
