-- AlterTable
ALTER TABLE "Boxer" ADD COLUMN     "formerChampion" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "height" DROP NOT NULL,
ALTER COLUMN "reach" DROP NOT NULL,
ALTER COLUMN "stance" DROP NOT NULL;
