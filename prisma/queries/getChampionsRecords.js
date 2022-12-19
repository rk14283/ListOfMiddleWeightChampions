//- Make a seperate file
//- Make a query where you get 1 boxer by their name
//- Make a query where you get 1 boxer by their name and get all of their fights
//- Make a query where you get 1 boxer by their name and get all of their fights with champions
//- Make a query where you get 1 boxer by their name and get all of their fights with champions where they won

const fs = require("fs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function queryingBoxer() {
  let oneBoxerByName = await prisma.boxer.findUnique({
    where: {
      name: "Thomas Hearns",
    },
  });

  //console.log(oneBoxerByName);
}

//queryingBoxer();

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

//queryingBoxerNameAndFights();

async function queryingBoxersAgainstChampions() {
  let oneBoxerName = await prisma.boxer.findUnique({
    where: {
      name: "Thomas Hearns",
    },
  });
  let oneBoxerId = oneBoxerName.id;
  let x = 9963;
  for (let i = 9858; i < 9963; i++) {
    let championFights = [];
    let opponents = await prisma.fight.findMany({
      where: {
        boxers: {
          ////some, every,none, every with ray leonard, I get one fight
          every: {
            //9927 gives an empty array because he never fought cotto
            //id: { in: [oneBoxerId, 9927] }
            //9858-9962 are champions

            id: {
              in: [oneBoxerId, i],
            },
          },
        },
      },
    });
    //console.log(opponents);
    for (var key in opponents) {
      //if (opponents[key] !== undefined && opponents[key].length === 0)
      if (opponents[key].length != 0 && opponents[key] !== undefined) {
        //Array contains all the champions  Tommy has fought
        championFights.push(opponents);
        //console.log(championFights);
        //if winnerid is 9956 then Tommy has won
        for (opponent of opponents) {
          if (opponent.winnerId === oneBoxerId) {
            console.log(opponents);
          }
        }
      }
    }
  }
}

async function queryingChampionRecords(name) {
  let oneBoxerByName = await prisma.boxer.findUnique({
    where: {
      name,
    },
    include: {
      fightsWon: {
        where: {
          boxers: {
            every: {
              formerChampion: true,
            },
          },
        },
      },
    },
  });
  console.log(oneBoxerByName.fightsWon.length);
}
//queryingChampionRecords("Sugar Ray Robinson");

async function fightsWonByKo(name) {
  let winnerByKo = await prisma.boxer.findUnique({
    where: {
      name,
    },
    include: {
      fights: {
        where: {
          winner: {
            name,
          },
          OR: [
            {
              outcome: {
                contains: "KO",
              },
            },
            {
              outcome: { contains: "RTD" },
            },
          ],
        },
      },
    },
  });
  console.log(winnerByKo);
  console.log(winnerByKo.fights.length);
  //result of this is 107 but in reality it is 109
  //bug: it is showing 2 less, for both Hearns and Robinson
  //validation error means input not acceptable, validation is process of checking is input acceptable
}

//fightsWonByKo("Thomas Hearns");
//fightsWonByKo("Sugar Ray Robinson");

async function findFightsWonByDecesionByName(name) {
  let wentTheDistance = await prisma.boxer.findUnique({
    where: {
      name,
    },
    include: {
      fights: {
        where: {
          winner: {
            name,
          },
          NOT: [
            {
              outcome: { contains: "KO" },
            },
            {
              outcome: { contains: "RTD" },
            },
            {
              outcome: { contains: "NC" },
            },
          ],
        },
      },
    },
  });
  console.log(wentTheDistance);
  console.log(wentTheDistance.fights.length);
  //bug it shows two extra by decesion
}
//findFightsWonByDecesionByName("Sugar Ray Robinson");

//count of all the wins by a boxer
async function countWins(name) {
  const boxerWinCount = await prisma.boxer.findUnique({
    //include is for related records
    //select specific field from a related record
    where: {
      //I do this I get boxer's info without the fight
      name,
    },
    select: {
      _count: {
        //I broke it down to bare bones steps and then final part was a guess
        select: {
          //fights of sugar Ray
          fightsWon: true,
          //fights, false and height true returns height
        },
      },
    },
  });
  console.log(boxerWinCount);
}

//countWins("Sugar Ray Robinson");
//countWins("Thomas Hearns");

async function countFights(name) {
  const boxerFightCount = await prisma.boxer.findUnique({
    //include is for related records
    //select specific field from a related record
    where: {
      //I do this I get boxer's info without the fight
      name,
    },
    select: {
      _count: {
        //I broke it down to bare bones steps and then final part was a guess
        select: {
          //fights of sugar Ray
          fights: true,
          //fights, false and height true returns height
        },
      },
    },
  });
  console.log(boxerFightCount);
}

//countFights("Sugar Ray Robinson");
//countFights("Thomas Hearns");

async function countWinsByKO(name) {
  const boxerFightCountByKO = await prisma.boxer.findUnique({
    //include is for related records
    //select specific field from a related record
    where: {
      name,
    },

    select: {
      fights: {
        select: {
          outcome: true,
        },
      },
    },

    //AND: { outcome: { contains: "KO" } },
    //fights, false and height true returns height
  });
  console.log(boxerFightCountByKO);
}

//countWinsByKO("Sugar Ray Robinson");
