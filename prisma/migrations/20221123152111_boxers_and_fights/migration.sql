-- CreateTable
CREATE TABLE "Boxer" (
    "id" SERIAL NOT NULL,
    "imageURL" TEXT,
    "name" TEXT,
    "nickName" TEXT NOT NULL,
    "height" INTEGER NOT NULL,
    "reach" INTEGER NOT NULL,
    "born" TIMESTAMP(3) NOT NULL,
    "died" TIMESTAMP(3) NOT NULL,
    "stance" TEXT NOT NULL,

    CONSTRAINT "Boxer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeightCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "WeightCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fight" (
    "id" SERIAL NOT NULL,
    "winnerId" INTEGER NOT NULL,
    "outcome" TEXT NOT NULL,
    "roundTime" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "notes" TEXT NOT NULL,

    CONSTRAINT "Fight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BoxerToFight" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BoxerToFight_AB_unique" ON "_BoxerToFight"("A", "B");

-- CreateIndex
CREATE INDEX "_BoxerToFight_B_index" ON "_BoxerToFight"("B");

-- AddForeignKey
ALTER TABLE "Fight" ADD CONSTRAINT "Fight_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "Boxer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BoxerToFight" ADD CONSTRAINT "_BoxerToFight_A_fkey" FOREIGN KEY ("A") REFERENCES "Boxer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BoxerToFight" ADD CONSTRAINT "_BoxerToFight_B_fkey" FOREIGN KEY ("B") REFERENCES "Fight"("id") ON DELETE CASCADE ON UPDATE CASCADE;
