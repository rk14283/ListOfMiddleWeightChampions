const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
let directroy = "boxers";
let files = fs.readdirSync(directroy);
const { v4: uuidv4 } = require("uuid");

let smapleID = uuidv4();
//console.log("This is a sampleUUID", smapleID);

const arrayOfBoxers = [];
const boxerHashMap = {};
for (var i = 0; i < files.length; i++) {
  files[i] = "boxers/" + files[i];
}

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
    // let dateTimeFormat = Date(matchesDateOfBirth);
    //console.log(dateTimeFormat);
    //dateTimeFormat = dateTimeFormat.toISOString();
    //console.log(dateTimeFormat);
    //1970-09-10T23:00:00.000Z
    //invalid date
    // if (dateTimeFormat == "Invalid Date") {
    //   //console.log(dateTimeFormat);
    //   dateTimeFormat = null;
    // }

    //console.log(dateTimeFormat);
    // console.log("this is converted birthDate", dateTimeFormat);

    let dateTimeFormatDeath = null;
    if (matchesDateOfDeath) {
      //date of death is converted to date time format
      dateTimeFormatDeath = new Date(matchesDateOfDeath);
    }
    //console.log(dateTimeFormatDeath);
    //console.log("this is death date", dateTimeFormatDeath);
    //const boxerId = uuidv4();
    const boxerInfoData = {
      //id: boxerId,
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
    //console.log(boxerHashMap);
    arrayOfBoxers.push(boxerInfoData);
  }
  try {
    const insertedBoxers = await prisma.boxer.createMany({
      //create just one object, so it has to be createMany, createMany just gives the number
      //this does not work with proper hashMap only works with object
      //data: boxerInfoData,
      data: arrayOfBoxers,
    });
    console.log(insertedBoxers);
    //console.timeEnd();
  } catch (error) {
    console.log(error);
  }
  //console.log(arrayOfBoxers.length);
}

//seedChampions();

// async function seedRecords() {
//   let directroy = "boxers";
//   let files = fs.readdirSync(directroy);

//   for (var i = 0; i < files.length; i++) {
//     files[i] = "boxers/" + files[i];
//     const boxerData = fs.readFileSync(files[i]);
//     const boxer = JSON.parse(boxerData);

//     for (fight of boxer.record) {
//       //console.log(fight);
//       const roundTime = fight.Round_Time;
//       const date = fight.Date;
//       const dateTimeFormat = new Date(date);
//       const outcome = fight.Type;
//       const location = fight.Location;

//       const notes = fight.Notes;
//       const trimmedResult = fight.Result?.trim();
//     }
//     let mainBoxer = await prisma.boxer.findUnique({
//       where: {
//         //name is assigned the value of boxer.name from boxer object and white space is trimmed
//         name: boxer.name.trim(),
//       },
//     });
//     let opponent = await prisma.boxer.findUnique({
//       where: {
//         //name is assigned value of opponent which it gets from fight object and whitespace is trimmed
//         name: fight.Opponent.trim(),
//       },
//     });
//     //console.log(opponent);
//     if (!opponent) {
//       // we upload opponent if it is not already in the database
//       opponent = await prisma.boxer.create({
//         data: {
//           //name gets value of opponent and white space is trimmed
//           name: fight.Opponent.trim(),
//           //here the opponent is not a former champion because we have already inserted champions
//           formerChampion: false,
//         },
//       });
//     }
//     console.log(opponent);
//   }
// }
// seedRecords();

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
  //console.time();
  const boxersToInsert = [];
  const boxerHashMap = await createHashMap();

  for (var i = 0; i < files.length; i++) {
    //files[i] = "boxers/" + files[i];
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
  console.timeEnd();
}

//getRecords();

let boxerFights = [];
const fightHashMap = {};
const fightsToInsert = [];
async function insertFights() {
  const boxerHashMap = await createHashMap();

  for (var i = 0; i < files.length; i++) {
    //    files[i] = "boxers/" + files[i];
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

      //console.log(fightWithRelatedData.connect);
      //two solutions, one would be to provide missing arguments, the other would be to use create
      //console.log(fightWithRelatedData.outcome);
    }
  }

  try {
    const insertedFights = await prisma.fight.createMany({
      data: fightsToInsert,
    });
    //missing field or incorrect field
    //   INSERT INTO "Foo" ("b", "a")
    // VALUES ${Prisma.join(
    //   testArr.map((row) => Prisma.sql`(${Prisma.join(row)})`)
    // )}
    // ON CONFLICT DO NOTHING;`;
    //     SET session_replication_role = 'replica';
    // SET session_replication_role = 'origin';

    const result = await prisma.$executeRaw`
    INSERT INTO "_BoxerToFight" ("A", "B")
    VALUES ${Prisma.join(
      boxerFights
        //.slice(0, 1000)
        .map((boxerFight) => Prisma.sql`(${boxerFight.A}, ${boxerFight.B})`)
    )}
    ON CONFLICT DO NOTHING;
    
    `;

    // const result = await prisma.$executeRaw`
    //  INSERT INTO "_BoxerToFight" ("A", "B")
    //  VALUES (${boxerFights[0].A},${boxerFights[0].B});
    //  `;
  } catch (error) {
    console.log("this entry did not work", error);
  }
}

insertFights();

// // - Read up on uuid (edited)
// // - Clear whole db
// // - Change schema to uuid (check prisma uuid) (edited)
// // - Install a package to create uuid's
// // - try to seed boxers with uuid's

// //What I have done so far:
// //intalled uuid
// //changed id to uuid, and modified winnerId
// //used npx generate and migrate
