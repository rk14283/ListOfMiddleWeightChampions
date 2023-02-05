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
      // name: "Thomas Hearns",
      name: "Sugar Ray Leonard",
      //name: "Marvelous Marvin Hagler",
      //id: '01337b86-8b65-4a5c-8604-bb60b09ee3bd'
    },
  });
  console.log(oneBoxerByName);
}

//queryingBoxer();

async function queryingBoxerById() {
  let oneBoxerById = await prisma.boxer.findUnique({
    where: {
      // name: "Thomas Hearns",
      //name: "Sugar Ray Leonard",
      id: "f80c71fc-6a3f-43d1-8cbc-fd6172a12ffa",
      //name: "Marvelous Marvin Hagler",
      //id: '01337b86-8b65-4a5c-8604-bb60b09ee3bd'
    },
  });
  //console.log(oneBoxerById);
}

//queryingBoxerById();

async function returnBoxerId() {
  let oneBoxerByName = await prisma.boxer.findUnique({
    where: {
      //name: "Thomas Hearns",
      // name: "Sugar Ray Leonard",
      //name: "Marvelous Marvin Hagler",
      //name: "Roberto Durán",
      name: "Jake LaMotta",
      //id: '01337b86-8b65-4a5c-8604-bb60b09ee3bd'
    },
  });
  console.log(oneBoxerByName.id);
}

//returnBoxerId();
async function queryingFightAgainstBoxerInRealLife() {
  let oneBoxerName = await prisma.boxer.findUnique({
    where: {
      //name: "Thomas Hearns",
      name: "Sugar Ray Robinson",
    },
  });

  let oneBoxerId = oneBoxerName.id;
  //console.log(oneBoxerId);

  //challenging part, querying the opponenets

  //FindMany returns whole record, findUnique error,and findFrist returns first record
  let boxerRecord = await prisma.boxer.findUnique({
    where: {
      id: oneBoxerId,
    },
    //This code returned Hagler's record
    include: {
      fights: {
        where: {
          boxers: {
            //every does not work, but works when used with two ids
            every: {
              //Findfirst and FindUnique returns same result but findmany returns an object or objects
              //Here it returns Hagler's record
              //La Motta's record when main boxer is jake
              id: {
                in: [oneBoxerId, "646b1f65-ee78-4813-96ed-c215b8b505f2"],
              },
              //id of Hearns, and it return's Ray Leonard for first, but for second it is Hearns
              //but it may not matter as I only need winnerId
              // id: {
              //   in: [oneBoxerId, "a8f6ae76-8e34-450a-ac6c-9b140ddf9229"],
              // },
              //This returns Duran's record
              //id: { in: ["63e29c30-dbbc-4ad8-8023-cfe9b38564f8"] },
              // id: {
              //   in: [oneBoxerId, "63e29c30-dbbc-4ad8-8023-cfe9b38564f8"],
              // },
            },
          },
        },
      },
    },
  });
  //for the fights
  //console.log(boxerRecord.fights);
  //now I can get the winner ID
  //console.log(boxerRecord.fights[0].winnerId);
  //this is how many times they fought in real life
  //console.log(boxerRecord.fights.length);
  //console.log(boxerRecord.fights.winnerId);
  let winnerIDs = [];
  for (var i = 0; i < boxerRecord.fights.length; i++) {
    //console.log(boxerRecord.fights[i].winnerId);
    winnerIDs.push(boxerRecord.fights[i].winnerId);
  }
  //console.log(winnerIDs);
}

queryingFightAgainstBoxerInRealLife();
async function queryingBoxerNameAndFights() {
  let oneBoxerName = await prisma.boxer.findUnique({
    where: {
      //name: "Thomas Hearns",
      name: "Sugar Ray Leonard",
    },
  });

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

async function queryingFightAgainstBoxer() {
  let oneBoxerName = await prisma.boxer.findUnique({
    where: {
      //name: "Thomas Hearns",
      name: "Sugar Ray Leonard",
    },
  });

  let oneBoxerId = oneBoxerName.id;

  let oneBoxerRecord = await prisma.fight.findFirst({
    where: {
      boxers: {
        //this worked but do not quite know why
        some: {
          id: { in: [oneBoxerId, "01337b86-8b65-4a5c-8604-bb60b09ee3bd"] },
        },
      },
    },
  });
  console.log(oneBoxerRecord);
}

//queryingBoxerNameAndFights();

//This will not work now because now we have uuids
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
            id: {
              in: [oneBoxerId, i],
            },
          },
        },
      },
    });
    //console.log(opponents);
    for (var key in opponents) {
      if (opponents[key].length != 0 && opponents[key] !== undefined) {
        championFights.push(opponents);
        for (opponent of opponents) {
          if (opponent.winnerId === oneBoxerId) {
            console.log(opponents);
          }
        }
      }
    }
  }
}

//queryingBoxersAgainstChampions();

async function queryingBoxersAgainstChampionsTwo() {
  let oneBoxerName = await prisma.boxer.findUnique({
    where: {
      name: "Thomas Hearns",
    },
  });
  let oneBoxerId = oneBoxerName.id;

  let opponents = await prisma.fight.findFirst({
    where: {
      boxers: {
        ////some, every,none, every with ray leonard, I get one fight
        some: {
          id: {
            contains: "01337b86-8b65-4a5c-8604-bb60b09ee3bd",
          },
        },
      },
    },
  });
  console.log(opponents);
  //   for (var key in opponents) {
  //     if (opponents[key].length != 0 && opponents[key] !== undefined) {
  //       championFights.push(opponents);
  //       for (opponent of opponents) {
  //         if (opponent.winnerId === oneBoxerId) {
  //           console.log(opponents);
  //         }
  //       }
  //     }
  //   }
}

//queryingBoxersAgainstChampionsTwo();

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
      name,
    },
    select: {
      _count: {
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
