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
      if (opponents[key].length != 0) {
        //Array contains all the champions  Tommy has fought
        championFights.push(opponents);
        //if winnerid is 9956 then Tommy has won
        for (opponent of opponents) {
          if (opponent.winnerId === oneBoxerId) {
            console.log(opponents);
          }
        }
      }
      //console.log(championFights);
    }
  }
}

queryingBoxersAgainstChampions();

////sugarrayleonard vs Tommy hearns
// let opponents = await prisma.fight.findMany({
//     where: {
//       boxers: {
//         ////some, every,none, every with ray leonard, I get one fight
//         every: {
//           id: { in: [9956, 9951] },
//         },
//       },
//     },
//   });
//   console.log(opponents);

// let x = 9963;
// for (let i = 9858; i < 9963; i++) {
//   console.log(i + ",");
// }

// 9858,
//                 9859,
//                 9860,
//                 9861,
//                 9862,
//                 9863,
//                 9864,
//                 9865,
//                 9866,
//                 9867,
//                 9868,
//                 9869,
//                 9870,
//                 9871,
//                 9872,
//                 9873,
//                 9874,
//                 9875,
//                 9876,
//                 9877,
//                 9878,
//                 9879,
//                 9880,
//                 9881,
//                 9882,
//                 9883,
//                 9884,
//                 9885,
//                 9886,
//                 9887,
//                 9888,
//                 9889,
//                 9890,
//                 9891,
//                 9892,
//                 9893,
//                 9894,
//                 9895,
//                 9896,
//                 9897,
//                 9898,
//                 9899,
//                 9900,
//                 9901,
//                 9902,
//                 9903,
//                 9904,
//                 9905,
//                 9906,
//                 9907,
//                 9908,
//                 9909,
//                 9910,
//                 9911,
//                 9912,
//                 9913,
//                 9914,
//                 9915,
//                 9916,
//                 9917,
//                 9918,
//                 9919,
//                 9920,
//                 9921,
//                 9922,
//                 9923,
//                 9924,
//                 9925,
//                 9926,
//                 9927,
//                 9928,
//                 9929,
//                 9930,
//                 9931,
//                 9932,
//                 9933,
//                 9934,
//                 9935,
//                 9936,
//                 9937,
//                 9938,
//                 9939,
//                 9940,
//                 9941,
//                 9942,
//                 9943,
//                 9944,
//                 9945,
//                 9946,
//                 9947,
//                 9948,
//                 9949,
//                 9950,
//                 9951,
//                 9952,
//                 9953,
//                 9954,
//                 9955,
//                 9956,
//                 9957,
//                 9958,
//                 9959,
//                 9960,
//                 9961,
//                 9962,

// const isEmpty = Object.keys(opponents).length === 0;
//   console.log(isEmpty);

// for(var key in obj){
//     if(obj[key]!==undefined && obj[key].length===0){
//         obj[key] = [""];
//     }
//    }
