/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Boxer` will be added. If there are existing duplicate values, this will fail.
  - Made the column `name` on table `Boxer` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Fight" DROP CONSTRAINT "Fight_winnerId_fkey";

-- AlterTable
ALTER TABLE "Boxer" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "nickName" DROP NOT NULL,
ALTER COLUMN "born" DROP NOT NULL,
ALTER COLUMN "died" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Fight" ALTER COLUMN "winnerId" DROP NOT NULL,
ALTER COLUMN "notes" DROP NOT NULL;

-- CreateTable
CREATE TABLE "_BoxerToWeightCategory" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BoxerToWeightCategory_AB_unique" ON "_BoxerToWeightCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_BoxerToWeightCategory_B_index" ON "_BoxerToWeightCategory"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Boxer_name_key" ON "Boxer"("name");

-- AddForeignKey
ALTER TABLE "Fight" ADD CONSTRAINT "Fight_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "Boxer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BoxerToWeightCategory" ADD CONSTRAINT "_BoxerToWeightCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Boxer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BoxerToWeightCategory" ADD CONSTRAINT "_BoxerToWeightCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "WeightCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
