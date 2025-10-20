/*
  Warnings:

  - Added the required column `createdBy` to the `Participant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "createdBy" TEXT NOT NULL,
ALTER COLUMN "uid" SET DEFAULT substr(md5(random()::text), 1, 8);
