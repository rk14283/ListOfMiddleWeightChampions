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
const fightsToInsert = [];
async function insertFights() {
  const boxerHashMap = await createHashMap();
  //console.log(boxerHashMap);

  for (var i = 0; i < files.length; i++) {
    files[i] = "boxers/" + files[i];
    const boxerData = fs.readFileSync(files[i]);
    const boxer = JSON.parse(boxerData);
    //console.log(boxer.record.length);
    //console.log(boxer.record.Notes);
    // const boxerName = boxer.record.Notes?.trim()?.replaceAll("\n", ", ");
    // ;
    //let boxerName = boxer.name;

    for (record of boxer.record) {
      //console.log(record.Date);
      //console.log(boxer.name);

      const cleanedNo = record.No?.trim()?.replaceAll("\n", "");
      const cleanedResult = record.Result?.trim()?.replaceAll("\n", "");
      const cleanedOpponent = record.Opponent?.trim()?.replaceAll("\n", "");
      const cleanedType = record.Type?.trim()?.replaceAll("\n", "");
      const cleanedRoundTime = record.Round_Time?.trim()?.replaceAll("\n", "");
      const cleanedLocation = record.Location?.trim()?.replaceAll("\n", "");
      const cleanedNotes = record.Notes?.trim()?.replaceAll("\n", "");
      let fightDate = new Date(record.Date.trim());
      let winnerId = null;

      //console.log(record.Date, boxer.name);
      //console.log(fightDate, fightDate === "Invalid Date");
      if (cleanedResult === "Win") {
        winnerId = 1;
      } else if (cleanedResult === "Loss") {
        winnerId = 2;
      }
      const cleanedRecord = {
        //No: cleanedNo,
        Date: fightDate,
        //Result: cleanedResult,
        // Opponent: cleanedOpponent,
        Type: cleanedType,
        Round_Time: cleanedRoundTime,
        //Location: cleanedLocation,
        //Notes: cleanedNotes,
        winnerId: winnerId,
        connect: { mainBoxer: boxer.name, opponentBoxer: cleanedOpponent },
        //showing one object instead of names
        //connect: [{ mainBoxer: boxer.name, OpponentBoxer: cleanedOpponent }],
        //showing two objects instead of one
        //connect: [{ name: boxer.name }, { name: cleanedOpponent }],
      };

      //console.log(cleanedRecord);
      //console.log(cleanedRecord.Date);
      try {
        fightHashMap[fightDate.toISOString()] = cleanedRecord;
        fightsToInsert.push(cleanedRecord);
      } catch (error) {
        //console.log(record.Date);
        if (record.Date.includes("/")) {
          const [day, month, year] = record.Date.trim().split("/");
          const fightDate = new Date(`${month}/${day}/${year}`);
          cleanedRecord.Date = fightDate;
          fightHashMap[fightDate.toISOString()] = cleanedRecord;
          fightsToInsert.push(cleanedRecord);
          //console.log(fightHashMap);
        } else if (record.Date.includes("-")) {
          const [year, month, day] = record.Date.trim().split("-");
          fightHashMap[fightDate.toISOString()] = record;
          const fightDate = new Date(`${month}/${day}/${year}`);
          cleanedRecord.Date = fightDate;
          fightHashMap[fightDate.toISOString()] = cleanedRecord;
          fightsToInsert.push(cleanedRecord);
        }
      }
      //console.log(fightDate);
      // console.log(cleanedRecord.Result);
      //infinite loop
      // console.log(fightsToInsert);
    }
    //infinite loop
    // console.log(fightsToInsert);
  }

  //This worked
  //console.log(fightHashMap["1985-01-17T23:00:00.000Z"]);
  //console.log(fightHashMap);
  //here the value of outcome does not change
  //this goes to 7839 to 7865 depending on where I use push
  //console.log(fightsToInsert);
  const insertedFights = await prisma.boxer.create({
    data: fightsToInsert,
  });
  console.log(insertedFights);
  console.timeEnd();
}

insertFights();
