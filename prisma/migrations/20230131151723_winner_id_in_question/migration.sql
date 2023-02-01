-- DropForeignKey
ALTER TABLE "Fight" DROP CONSTRAINT "Fight_winnerId_fkey";

-- AlterTable
ALTER TABLE "Fight" ALTER COLUMN "winnerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Fight" ADD CONSTRAINT "Fight_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "Boxer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
