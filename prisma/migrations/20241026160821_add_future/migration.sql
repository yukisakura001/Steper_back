/*
  Warnings:

  - Added the required column `future` to the `Goal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Goal" ADD COLUMN     "future" TEXT NOT NULL;
