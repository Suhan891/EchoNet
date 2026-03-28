/*
  Warnings:

  - Added the required column `cloudId` to the `PostPhoto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cloudId` to the `Reel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cloudId` to the `StoryMedia` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PostPhoto" ADD COLUMN     "cloudId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Reel" ADD COLUMN     "cloudId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "StoryMedia" ADD COLUMN     "cloudId" TEXT NOT NULL;
