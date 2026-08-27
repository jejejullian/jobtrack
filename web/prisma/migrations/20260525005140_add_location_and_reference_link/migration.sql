/*
  Warnings:

  - You are about to drop the `_JobToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_JobToUser" DROP CONSTRAINT "_JobToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_JobToUser" DROP CONSTRAINT "_JobToUser_B_fkey";

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "location" TEXT,
ADD COLUMN     "referenceLink" TEXT;

-- DropTable
DROP TABLE "_JobToUser";

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
