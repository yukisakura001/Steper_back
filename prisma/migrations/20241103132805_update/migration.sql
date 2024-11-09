/*
  Warnings:

  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "username";

-- CreateTable
CREATE TABLE "TempUser" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "verificationToken" TEXT NOT NULL,

    CONSTRAINT "TempUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TempUser_email_key" ON "TempUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TempUser_verificationToken_key" ON "TempUser"("verificationToken");
