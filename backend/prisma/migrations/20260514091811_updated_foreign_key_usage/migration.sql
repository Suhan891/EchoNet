-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_replyId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderId_fkey";

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "ChatMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
