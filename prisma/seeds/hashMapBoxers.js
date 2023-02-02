const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
let directroy = "boxers";
let files = fs.readdirSync(directroy);
const { v4: uuidv4 } = require("uuid");
const dayjs = require("dayjs");

for (var i = 0; i < files.length; i++) {
  files[i] = "boxers/" + files[i];
}
const arrayOfBoxers = [];
let boxerHashMap = {};
//const opponentHashMap = {};
let boxerFights = [];
const fightHashMap = {};
const fightsToInsert = [];

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
    const dateOfBirth = boxer?.Born;
    const deathDate = boxer?.Died;

    const matchesDateOfBirth = dateOfBirth?.match(/\(([^()]*)\)/);
    const matchesDateOfDeath = deathDate?.match(/\(([^()]*)\)/);

    let dateTimeFormat = new Date(matchesDateOfBirth);

    let dateTimeFormatDeath = null;
    if (matchesDateOfDeath) {
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
  } catch (error) {
    console.log(error);
  }
}

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
const opponentHashMap = {};
async function getRecords() {
  boxerHashMap = await createHashMap();
  const boxersToInsert = [];

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
  const insertedOpponents = await prisma.boxer.createMany({
    data: boxersToInsert,
  });
  console.log(insertedOpponents);
}

async function insertFights() {
  boxerHashMap = await createHashMap();
  const fightHashMap = {};

  for (var i = 0; i < files.length; i++) {
    const boxerData = fs.readFileSync(files[i]);
    const boxer = JSON.parse(boxerData);
    for (record of boxer.record) {
      const mainBoxerName = boxer.name.trim();
      const cleanedNo = record.No?.trim()?.replaceAll("\n", "");
      const cleanedResult = record.Result?.trim()?.replaceAll("\n", "");
      const cleanedOpponent = record.Opponent?.trim()?.replaceAll("\n", "");
      const cleanedType = record.Type?.trim()?.replaceAll("\n", "");
      const cleanedRoundTime = record.Round_Time?.trim()?.replaceAll("\n", "");
      const cleanedLocation = record.Location?.trim()?.replaceAll("\n", "");
      const cleanedNotes = record.Notes?.trim()?.replaceAll("\n", "");
      let fightDate = new Date(record.Date.trim());
      let winnerId = null;
      const mainBoxerId = boxerHashMap[mainBoxerName].id;
      const opponentBoxerId = boxerHashMap[cleanedOpponent].id;
      if (record.Date.includes("–")) {
        const [year, month, day] = record.Date.trim().split("–");
        record.Date = `${month}/${day}/${year}`;
      } else if (record.Date.includes("/")) {
        const [day, month, year] = record.Date.trim().split("/");
        record.Date = `${month}/${day}/${year}`;
      } else if (record.Date.includes("-")) {
        const [year, month, day] = record.Date.trim().split("-");
        record.Date = `${month}/${day}/${year}`;
      }
      const test = dayjs(record.Date.trim()).format("YYYY/MM/DD");

      if (
        fightHashMap[test] &&
        (fightHashMap[test][mainBoxerId] || fightHashMap[test][opponentBoxerId])
      ) {
        continue;
        console.log("duplicate", fightHashMap[test][mainBoxerId], record);
      }

      if (!test) {
        console.log(record.Date);
      }

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
        date: new Date(test),
      };
      const boxerFight = [
        { A: mainBoxerId, B: fightId },
        { A: opponentBoxerId, B: fightId },
      ];
      boxerFights = boxerFights.concat(boxerFight);
      fightsToInsert.push(cleanedRecord);
      if (!fightHashMap[test]) {
        fightHashMap[test] = {};
      }
      fightHashMap[test][mainBoxerId] = cleanedRecord;
      fightHashMap[test][opponentBoxerId] = cleanedRecord;
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
async function seedEverything() {
  console.time();
  await seedChampions();
  await getRecords();

  await insertFights();
  console.timeEnd();
}
seedEverything();
