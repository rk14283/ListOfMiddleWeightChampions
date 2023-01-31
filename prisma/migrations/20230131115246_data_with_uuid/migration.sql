/*
  Warnings:

  - The primary key for the `Boxer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Fight` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `winnerId` on table `Fight` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Fight" DROP CONSTRAINT "Fight_winnerId_fkey";

-- DropForeignKey
ALTER TABLE "_BoxerToFight" DROP CONSTRAINT "_BoxerToFight_A_fkey";

-- DropForeignKey
ALTER TABLE "_BoxerToFight" DROP CONSTRAINT "_BoxerToFight_B_fkey";

-- DropForeignKey
ALTER TABLE "_BoxerToWeightCategory" DROP CONSTRAINT "_BoxerToWeightCategory_A_fkey";

-- AlterTable
ALTER TABLE "Boxer" DROP CONSTRAINT "Boxer_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Boxer_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Boxer_id_seq";

-- AlterTable
ALTER TABLE "Fight" DROP CONSTRAINT "Fight_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "winnerId" SET NOT NULL,
ALTER COLUMN "winnerId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Fight_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Fight_id_seq";

-- AlterTable
ALTER TABLE "_BoxerToFight" ALTER COLUMN "A" SET DATA TYPE TEXT,
ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_BoxerToWeightCategory" ALTER COLUMN "A" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Fight" ADD CONSTRAINT "Fight_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "Boxer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BoxerToFight" ADD CONSTRAINT "_BoxerToFight_A_fkey" FOREIGN KEY ("A") REFERENCES "Boxer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BoxerToFight" ADD CONSTRAINT "_BoxerToFight_B_fkey" FOREIGN KEY ("B") REFERENCES "Fight"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BoxerToWeightCategory" ADD CONSTRAINT "_BoxerToWeightCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Boxer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
