const { PrismaClient } = require("@prisma/client");
const { createHash } = require("crypto");
const prisma = new PrismaClient();
//let oneBoxerId = oneBoxerName.id;
const fs = require("fs");
let directroy = "boxers";
let files = fs.readdirSync(directroy);

async function queryingAllBoxers() {
  let allBoxers = await prisma.boxer.findMany({
    where: {},
  });
  //console.log(allBoxers);
  return allBoxers;
}

async function createHashMap() {
  const boxerHashMap = {};
  const allBoxers = await queryingAllBoxers();
  //console.log(allBoxers);
  for (boxer of allBoxers) {
    boxerHashMap[boxer.name] = boxer;
  }
  //console.log(boxerHashMap);
  return boxerHashMap;
}
//createHashMap();

const opponentHashMap = {};
async function getRecords() {
  console.time();
  const boxersToInsert = [];
  const boxerHashMap = await createHashMap();

  for (var i = 0; i < files.length; i++) {
    files[i] = "boxers/" + files[i];
    const boxerData = fs.readFileSync(files[i]);
    const boxer = JSON.parse(boxerData);
    //console.log(boxer.record.length);
    // boxerArray.push(boxer.record);
    for (record of boxer.record) {
      let opponentName = record.Opponent?.replaceAll("\n", "").trim();
      if (!(opponentName in boxerHashMap)) {
        //console.log("test", opponentName);
        const boxer = {
          name: opponentName,
          formerChampion: false,
        };
        boxerHashMap[opponentName] = boxer;
        boxersToInsert.push(boxer);
      }

      //console.log(record.Opponent);
    }
  }
  //console.log(opponentHashMap);
  //console.log(boxerHashMap);
  console.log(boxersToInsert);
  const insertedOpponents = await prisma.boxer.createMany({
    data: boxersToInsert,
  });
  console.log(insertedOpponents);
  console.timeEnd();
}

//getRecords();

const fightHashMap = {};
async function insertFights() {
  const boxerHashMap = await createHashMap();
  //console.log(boxerHashMap);

  for (var i = 0; i < files.length; i++) {
    files[i] = "boxers/" + files[i];
    const boxerData = fs.readFileSync(files[i]);
    const boxer = JSON.parse(boxerData);
    //console.log(boxer.record.length);
    //console.log(boxer.record);

    for (record of boxer.record) {
      //console.log(record.Date);

      fightHashMap[record.Date] = record;
    }
  }
  //console.log(fightHashMap);
}

insertFights();
