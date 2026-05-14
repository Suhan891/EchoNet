/*
  Warnings:

  - You are about to drop the column `isApproved` on the `Notification` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[jobId]` on the table `Job` will be added. If there are existing duplicate values, this will fail.
  - Made the column `isApproved` on table `ChatMember` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "JobStatus" ADD VALUE 'CANCELLED';

-- AlterTable
ALTER TABLE "ChatMember" ALTER COLUMN "isApproved" SET NOT NULL;

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "isApproved";

-- CreateIndex
CREATE UNIQUE INDEX "Job_jobId_key" ON "Job"("jobId");
