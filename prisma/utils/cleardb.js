const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seed() {
  const inserted = await prisma.boxer.deleteMany({
    where: {},
  });
  console.log(inserted);
}

seed();
