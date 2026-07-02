/*
  Warnings:

  - A unique constraint covering the columns `[storyId]` on the table `Job` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[postId]` on the table `Job` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Job_storyId_key" ON "Job"("storyId");

-- CreateIndex
CREATE UNIQUE INDEX "Job_postId_key" ON "Job"("postId");

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
