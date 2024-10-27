/*
  Warnings:

  - Added the required column `reward` to the `Steps` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Steps" ADD COLUMN     "reward" TEXT NOT NULL;
