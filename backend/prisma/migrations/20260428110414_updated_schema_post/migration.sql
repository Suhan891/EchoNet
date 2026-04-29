/*
  Warnings:

  - Made the column `caption` on table `Post` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "description" TEXT,
ALTER COLUMN "caption" SET NOT NULL;
