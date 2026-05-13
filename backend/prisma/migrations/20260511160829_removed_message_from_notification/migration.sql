/*
  Warnings:

  - The values [MESSAGE] on the enum `Purpose` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Purpose_new" AS ENUM ('COMMENT', 'POST', 'REEL', 'STORY', 'CHAT');
ALTER TABLE "Notification" ALTER COLUMN "purpose" TYPE "Purpose_new" USING ("purpose"::text::"Purpose_new");
ALTER TYPE "Purpose" RENAME TO "Purpose_old";
ALTER TYPE "Purpose_new" RENAME TO "Purpose";
DROP TYPE "public"."Purpose_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_messageId_fkey";
