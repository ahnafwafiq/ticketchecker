-- AlterTable
ALTER TABLE "Participant" ALTER COLUMN "uid" SET DEFAULT substr(md5(random()::text), 1, 8);
