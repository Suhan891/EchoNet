/*
  Warnings:

  - You are about to drop the column `isApproved` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `isGroup` on the `Chat` table. All the data in the column will be lost.
  - Added the required column `type` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ChatType" AS ENUM ('PRIVATE', 'GROUP');

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderId_fkey";

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "isApproved",
DROP COLUMN "isGroup",
ADD COLUMN     "type" "ChatType" NOT NULL;

-- AlterTable
ALTER TABLE "ChatMember" ADD COLUMN     "isApproved" BOOLEAN DEFAULT false;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "ChatMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
