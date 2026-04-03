/*
  Warnings:

  - You are about to drop the column `parentComment` on the `Comments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comments" DROP COLUMN "parentComment",
ADD COLUMN     "parentId" TEXT;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
