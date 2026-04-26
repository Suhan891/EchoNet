-- CreateEnum
CREATE TYPE "JobName" AS ENUM ('STORY', 'POST');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PROGRESS', 'SUCCESS', 'FAILED');

-- AlterEnum
ALTER TYPE "Media" ADD VALUE 'COMBINED';

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "isReady" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Story" ADD COLUMN     "isReady" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "name" "JobName" NOT NULL,
    "status" "JobStatus" NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
