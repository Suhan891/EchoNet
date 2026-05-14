/*
  Warnings:

  - You are about to drop the column `userId` on the `Job` table. All the data in the column will be lost.
  - Added the required column `profileId` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_userId_fkey";

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "userId",
ADD COLUMN     "profileId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
