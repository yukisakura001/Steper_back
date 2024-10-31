-- DropForeignKey
ALTER TABLE "Steps" DROP CONSTRAINT "Steps_goalId_fkey";

-- AddForeignKey
ALTER TABLE "Steps" ADD CONSTRAINT "Steps_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
