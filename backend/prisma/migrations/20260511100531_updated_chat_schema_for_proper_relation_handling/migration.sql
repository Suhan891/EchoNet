/*
  Warnings:

  - You are about to drop the column `profileId` on the `MessageView` table. All the data in the column will be lost.
  - You are about to drop the `_ProfileChats` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[msgId,memberId]` on the table `MessageView` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `memberId` to the `MessageView` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_chatId_fkey";

-- DropForeignKey
ALTER TABLE "MessageView" DROP CONSTRAINT "MessageView_msgId_fkey";

-- DropForeignKey
ALTER TABLE "MessageView" DROP CONSTRAINT "MessageView_profileId_fkey";

-- DropForeignKey
ALTER TABLE "_ProfileChats" DROP CONSTRAINT "_ProfileChats_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProfileChats" DROP CONSTRAINT "_ProfileChats_B_fkey";

-- DropIndex
DROP INDEX "MessageView_msgId_profileId_key";

-- AlterTable
ALTER TABLE "MessageView" DROP COLUMN "profileId",
ADD COLUMN     "memberId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_ProfileChats";

-- CreateTable
CREATE TABLE "ChatMember" (
    "id" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChatMember_chatId_profileId_key" ON "ChatMember"("chatId", "profileId");

-- CreateIndex
CREATE UNIQUE INDEX "MessageView_msgId_memberId_key" ON "MessageView"("msgId", "memberId");

-- AddForeignKey
ALTER TABLE "ChatMember" ADD CONSTRAINT "ChatMember_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMember" ADD CONSTRAINT "ChatMember_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageView" ADD CONSTRAINT "MessageView_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "ChatMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageView" ADD CONSTRAINT "MessageView_msgId_fkey" FOREIGN KEY ("msgId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
