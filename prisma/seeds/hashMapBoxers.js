const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
let directroy = "boxers";
let files = fs.readdirSync(directroy);
const { v4: uuidv4 } = require("uuid");

for (var i = 0; i < files.length; i++) {
  files[i] = "boxers/" + files[i];
}
const arrayOfBoxers = [];
let boxerHashMap = {};
const opponentHashMap = {};
let boxerFights = [];
const fightHashMap = {};
const fightsToInsert = [];

async function seedEverything() {
  async function seedChampions() {
    for (var i = 0; i < files.length; i++) {
      //reads JSON from file turning it to js object
      const boxersRecord = fs.readFileSync(files[i]);
      const boxer = JSON.parse(boxersRecord);

      //removes white space or other characters, returns only name
      const boxerName = boxer.name?.trim();
      let updatedStance = null;
      if (boxer.Stance) {
        updatedStance = boxer.Stance;
      }
      const regExp = /\(([^)]+)\)/;
      const matchesReach = regExp.exec(boxer.Reach);
      const matchesHeight = regExp.exec(boxer.Height);
      let updatedHeight = 0;
      if (boxer.Height && matchesHeight != null) {
        updatedHeight = parseInt(matchesHeight[1]);
        if (updatedHeight > 0 && updatedHeight < 10) {
          updatedHeight = updatedHeight * 10;
        }
      }
      //console.log("this is new Height", updatedHeight);
      let updatedReach = 0;
      if (boxer.Reach && matchesReach) {
        if (matchesReach[1].includes("cm")) {
          updatedReach = parseInt(matchesReach[1]);
          //if height is not in cm then it is converted to floating point, multiplied to 100 and then rounded off
        } else {
          updatedReach = parseFloat(matchesReach[1]) * 100;
          updatedReach = Math.floor(updatedReach);
        }
        if (updatedReach > 200) {
          updatedReach = Math.floor((updatedReach / 100) * 2.54);
        }
      }
      //console.log("This is new reach", updatedReach);
      const dateOfBirth = boxer?.Born;
      const deathDate = boxer?.Died;

      //console.log("This is birthdate", dateOfBirth);
      //console.log("THis is death date", deathDate);
      const matchesDateOfBirth = dateOfBirth?.match(/\(([^()]*)\)/);
      const matchesDateOfDeath = deathDate?.match(/\(([^()]*)\)/);
      //const dateTimeFormat = matchesDateOfBirth.toISOString();

      let dateTimeFormat = new Date(matchesDateOfBirth);

      let dateTimeFormatDeath = null;
      if (matchesDateOfDeath) {
        //date of death is converted to date time format
        dateTimeFormatDeath = new Date(matchesDateOfDeath);
      }
      const boxerInfoData = {
        imageURL: boxer.imageUrl?.substring(2),
        name: boxerName,
        nickName: boxer["Nickname(s)"]?.trim()?.replaceAll("\n", ", "),
        formerChampion: true,
        height: updatedHeight,
        reach: updatedReach,
        born: dateTimeFormat,
        died: dateTimeFormatDeath,
        stance: updatedStance,
      };
      boxerHashMap[boxerName] = boxerInfoData;
      arrayOfBoxers.push(boxerInfoData);
    }
    try {
      const insertedBoxers = await prisma.boxer.createMany({
        data: arrayOfBoxers,
      });
      console.log(insertedBoxers);
      //console.timeEnd();
    } catch (error) {
      console.log(error);
    }
  }

  await seedChampions();
  async function queryingAllBoxers() {
    let allBoxers = await prisma.boxer.findMany({
      where: {},
    });
    return allBoxers;
  }

  async function createHashMap() {
    const boxerHashMap = {};
    const allBoxers = await queryingAllBoxers();
    for (boxer of allBoxers) {
      boxerHashMap[boxer.name] = boxer;
    }
    return boxerHashMap;
  }
  boxerHashMap = await createHashMap();
  //  console.log(boxerHashMap);
  const opponentHashMap = {};
  async function getRecords() {
    //console.time();
    const boxersToInsert = [];
    //const boxerHashMap = await createHashMap();

    for (var i = 0; i < files.length; i++) {
      const boxerData = fs.readFileSync(files[i]);
      const boxer = JSON.parse(boxerData);
      for (record of boxer.record) {
        let opponentName = record.Opponent?.replaceAll("\n", "").trim();
        if (!(opponentName in boxerHashMap)) {
          const boxer = {
            name: opponentName,
            formerChampion: false,
          };
          boxerHashMap[opponentName] = boxer;
          boxersToInsert.push(boxer);
        }
      }
    }
    //console.log(boxersToInsert);
    const insertedOpponents = await prisma.boxer.createMany({
      data: boxersToInsert,
    });
    console.log(insertedOpponents);
    //console.timeEnd();
  }

  await getRecords();
  async function insertFights() {
    boxerHashMap = await createHashMap();

    for (var i = 0; i < files.length; i++) {
      const boxerData = fs.readFileSync(files[i]);
      const boxer = JSON.parse(boxerData);
      for (record of boxer.record) {
        const mainBoxerName = boxer.name.trim();
        const cleanedNo = record.No?.trim()?.replaceAll("\n", "");
        const cleanedResult = record.Result?.trim()?.replaceAll("\n", "");
        const cleanedOpponent = record.Opponent?.trim()?.replaceAll("\n", "");
        const cleanedType = record.Type?.trim()?.replaceAll("\n", "");
        const cleanedRoundTime = record.Round_Time?.trim()?.replaceAll(
          "\n",
          ""
        );
        const cleanedLocation = record.Location?.trim()?.replaceAll("\n", "");
        const cleanedNotes = record.Notes?.trim()?.replaceAll("\n", "");
        let fightDate = new Date(record.Date.trim());
        let winnerId = null;
        const mainBoxerId = boxerHashMap[mainBoxerName].id;
        const opponentBoxerId = boxerHashMap[cleanedOpponent].id;
        //look up IDs of boxers from hashMap
        if (cleanedResult === "Win") {
          winnerId = mainBoxerId;
        } else if (cleanedResult === "Loss") {
          winnerId = opponentBoxerId;
        }
        const fightId = uuidv4();
        const cleanedRecord = {
          id: fightId,
          outcome: cleanedType,
          roundTime: cleanedRoundTime,
          location: cleanedLocation,
          notes: cleanedNotes,
          winnerId: winnerId,
        };
        const boxerFight = [
          { A: mainBoxerId, B: fightId },
          { A: opponentBoxerId, B: fightId },
        ];
        boxerFights = boxerFights.concat(boxerFight);
        //console.log(boxerFight);
        try {
          cleanedRecord.date = fightDate.toISOString();
          fightsToInsert.push(cleanedRecord);
        } catch (error) {
          if (record.Date.includes("/")) {
            const [day, month, year] = record.Date.trim().split("/");
            const fightDate = new Date(`${month}/${day}/${year}`);
            cleanedRecord.date = fightDate.toISOString();
            fightsToInsert.push(cleanedRecord);
          } else if (record.Date.includes("-")) {
            const [year, month, day] = record.Date.trim().split("-");
            const fightDate = new Date(`${month}/${day}/${year}`);
            fightHashMap[fightDate.toISOString()] = record;
            cleanedRecord.date = fightDate.toISOString();
            fightsToInsert.push(cleanedRecord);
          } else if (record.Date.includes("–")) {
            const [year, month, day] = record.Date.trim().split("–");
            const fightDate = new Date(`${month}/${day}/${year}`);
            fightHashMap[fightDate.toISOString()] = record;
            cleanedRecord.date = fightDate.toISOString();
            fightsToInsert.push(cleanedRecord);
          }
        }
      }
    }
    try {
      const insertedFights = await prisma.fight.createMany({
        data: fightsToInsert,
      });
      const result = await prisma.$executeRaw`
      INSERT INTO "_BoxerToFight" ("A", "B")
      VALUES ${Prisma.join(
        boxerFights.map(
          (boxerFight) => Prisma.sql`(${boxerFight.A}, ${boxerFight.B})`
        )
      )}
      ON CONFLICT DO NOTHING;
      `;
    } catch (error) {
      console.log("this entry did not work", error);
    }
  }

  await insertFights();
  console.time();
  console.timeEnd();
}
seedEverything();
