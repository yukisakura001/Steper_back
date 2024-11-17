/*
  Warnings:

  - Changed the type of `clearTime` on the `Steps` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Steps" DROP COLUMN "clearTime",
ADD COLUMN     "clearTime" TIMESTAMP(3) NOT NULL;
