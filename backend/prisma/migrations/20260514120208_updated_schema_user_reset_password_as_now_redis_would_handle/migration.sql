/*
  Warnings:

  - You are about to drop the column `passResetExpTime` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passResetToken` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "passResetExpTime",
DROP COLUMN "passResetToken";
