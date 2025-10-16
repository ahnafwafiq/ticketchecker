-- CreateTable
CREATE TABLE "Participant" (
    "id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL DEFAULT substr(md5(random()::text), 1, 8),
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "emergencyContact" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Participant_uid_key" ON "Participant"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_email_key" ON "Participant"("email");
