/*
  Warnings:

  - You are about to drop the column `postPhotoId` on the `SavePost` table. All the data in the column will be lost.
  - You are about to drop the `PostPhoto` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `postMediaId` to the `SavePost` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PostPhoto" DROP CONSTRAINT "PostPhoto_postId_fkey";

-- DropForeignKey
ALTER TABLE "SavePost" DROP CONSTRAINT "SavePost_postPhotoId_fkey";

-- AlterTable
ALTER TABLE "SavePost" DROP COLUMN "postPhotoId",
ADD COLUMN     "postMediaId" TEXT NOT NULL;

-- DropTable
DROP TABLE "PostPhoto";

-- CreateTable
CREATE TABLE "PostMedia" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "cloudId" TEXT NOT NULL,

    CONSTRAINT "PostMedia_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PostMedia" ADD CONSTRAINT "PostMedia_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavePost" ADD CONSTRAINT "SavePost_postMediaId_fkey" FOREIGN KEY ("postMediaId") REFERENCES "PostMedia"("id") ON DELETE CASCADE ON UPDATE CASCADE;
