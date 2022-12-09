const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seed() {
  const deletedFights = await prisma.fight.deleteMany({
    where: {},
  });
  console.log(deletedFights);
  const deletedBoxers = await prisma.boxer.deleteMany({
    where: {},
  });
  console.log(deletedBoxers);
}

seed();
