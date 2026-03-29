/*
  Warnings:

  - A unique constraint covering the columns `[profileId]` on the table `Story` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Story_profileId_key" ON "Story"("profileId");
