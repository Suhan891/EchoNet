/*
  Warnings:

  - The values [LIKE,FOLLOW] on the enum `Purpose` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `message` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `Notification` table. All the data in the column will be lost.
  - Added the required column `content` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Purpose_new" AS ENUM ('COMMENT', 'MESSAGE', 'POST', 'REEL', 'STORY', 'CHAT');
ALTER TABLE "Notification" ALTER COLUMN "purpose" TYPE "Purpose_new" USING ("purpose"::text::"Purpose_new");
ALTER TYPE "Purpose" RENAME TO "Purpose_old";
ALTER TYPE "Purpose_new" RENAME TO "Purpose";
DROP TYPE "public"."Purpose_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_senderId_fkey";

-- DropIndex
DROP INDEX "Notification_senderId_idx";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "message",
DROP COLUMN "senderId",
ADD COLUMN     "chatId" TEXT,
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "messageId" TEXT,
ADD COLUMN     "postId" TEXT,
ADD COLUMN     "reelId" TEXT,
ADD COLUMN     "storyId" TEXT;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_reelId_fkey" FOREIGN KEY ("reelId") REFERENCES "Reel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
