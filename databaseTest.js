const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function query() {
  const boxers = await prisma.boxer.findMany({});
  console.log(boxers);
}

query();
