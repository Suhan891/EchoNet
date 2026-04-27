/*
  Warnings:

  - A unique constraint covering the columns `[profileId,postId]` on the table `Likes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[profileId,reelId]` on the table `Likes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[profileId,storyMediaId]` on the table `Likes` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Likes_profileId_postId_idx";

-- DropIndex
DROP INDEX "Likes_profileId_reelId_idx";

-- DropIndex
DROP INDEX "Likes_profileId_storyMediaId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Likes_profileId_postId_key" ON "Likes"("profileId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "Likes_profileId_reelId_key" ON "Likes"("profileId", "reelId");

-- CreateIndex
CREATE UNIQUE INDEX "Likes_profileId_storyMediaId_key" ON "Likes"("profileId", "storyMediaId");
