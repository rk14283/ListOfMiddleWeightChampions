//- Make a seperate file
//- Make a query where you get 1 boxer by their name
//- Make a query where you get 1 boxer by their name and get all of their fights
//- Make a query where you get 1 boxer by their name and get all of their fights with champions
//- Make a query where you get 1 boxer by their name and get all of their fights with champions where they won

const fs = require("fs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function queryingBoxers() {
  let oneBoxerByName = await prisma.boxer.findUnique({
    where: {
      name: "Thomas Hearns",
    },
  });

  //console.log(oneBoxerByName);
}

//queryingBoxers();

async function queryingBoxerNameAndFights() {
  let oneBoxerName = await prisma.boxer.findUnique({
    where: {
      name: "Thomas Hearns",
    },
  });

  // console.log(oneBoxerName.id);

  let oneBoxerId = oneBoxerName.id;

  let oneBoxerRecord = await prisma.fight.findMany({
    where: {
      boxers: {
        //this worked but do not quite know why
        some: {
          id: { in: [oneBoxerId] },
        },
      },
    },
  });
  console.log(oneBoxerRecord);
}

queryingBoxerNameAndFights();
