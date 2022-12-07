const fs = require("fs");
const { PrismaClient } = require("@prisma/client");
const { Console } = require("console");

const prisma = new PrismaClient();
let directroy = "boxers";
let files = fs.readdirSync(directroy);

for (var i = 0; i < files.length; i++) {
  files[i] = "boxers/" + files[i];
}

async function seedChampions() {
  let opponentArray = [];
  for (var i = 0; i < files.length; i++) {
    const boxersRecord = fs.readFileSync(files[i]);
    const readableBoxerRecord = JSON.parse(boxersRecord);

    const fightRecord = readableBoxerRecord.record;
    //console.log(fightRecord);
    //console.log(opponentArray);
    const boxerName = readableBoxerRecord.name;
    // console.log(boxerName);

    for (fight of fightRecord) {
      //console.log(fight.Opponent);
      //opponentArray = fight.Opponent.trim();

      //console.log("name of the opponent", fight.Opponent.trim());
      //opponentArray = fight.Opponent.trim();
      ////outside the loop it is only printing Al hostak
      opponentArray.push(fight.Opponent.trim());
      //  console.log("inside the loop", opponentArray);
    }

    //console.log(opponentArray);
    if (readableBoxerRecord.Stance) {
      updatedStance = readableBoxerRecord.Stance;
    }
    const regExp = /\(([^)]+)\)/;
    const matchesReach = regExp.exec(readableBoxerRecord.Reach);
    const matchesHeight = regExp.exec(readableBoxerRecord.Height);
    let updatedHeight = 0;

    if (readableBoxerRecord.Height && matchesHeight != null) {
      updatedHeight = parseInt(matchesHeight[1]);
      if (updatedHeight > 0 && updatedHeight < 10) {
        updatedHeight = updatedHeight * 10;
      }
    }

    let updatedReach = 0;
    if (readableBoxerRecord.Reach && matchesReach) {
      if (matchesReach[1].includes("cm")) {
        updatedReach = parseInt(matchesReach[1]);
      } else {
        updatedReach = parseFloat(matchesReach[1]) * 100;
        updatedReach = Math.floor(updatedReach);
      }
      if (updatedReach > 200) {
        updatedReach = Math.floor((updatedReach / 100) * 2.54);
      }
    }

    const dateOfBirth = readableBoxerRecord?.Born;
    const deathDate = readableBoxerRecord?.Died;
    const matchesDateOfBirth = dateOfBirth?.match(/\(([^()]*)\)/);
    const matchesDateOfDeath = deathDate?.match(/\(([^()]*)\)/);
    const dateTimeFormat = new Date(matchesDateOfBirth);
    let dateTimeFormatDeath = null;
    if (matchesDateOfDeath) {
      dateTimeFormatDeath = new Date(matchesDateOfDeath);
    }

    const inserted = await prisma.boxer.create({
      data: {
        imageURL: readableBoxerRecord.imageUrl?.substring(2),
        name: readableBoxerRecord?.name,
        nickName: readableBoxerRecord["Nickname(s)"]
          ?.trim()
          ?.replaceAll("\n", ", "),
        formerChampion: true,
        height: updatedHeight,
        reach: updatedReach,
        born: dateTimeFormat,
        died: dateTimeFormatDeath,
        stance: updatedStance,
      },
    });
    console.log(inserted);
  }

  //  console.log("outside the loop", opponentArray);
  //JSON file of tommy hearns, insert only tommy hearn's record
  // let filePathTommyHearns = "boxers/Thomas_Hearns.json";

  // const boxersRecordTommyHearns = fs.readFileSync(filePathTommyHearns);

  // const readableBoxerRecordTommyHearns = JSON.parse(boxersRecordTommyHearns);
  // //console.log(readableBoxerRecordTommyHearns);
  // //console.log(readableBoxerRecordTommyHearns.record);

  // const tommyRecord = [];
  // tommyRecord.push(readableBoxerRecordTommyHearns.record);
  // //console.log(readableBoxerRecordTommyHearns.record);

  // //lastFight = tommyRecord[0][1];

  // // console.log(lastFight.Type);
  // //console.log(readableBoxerRecordTommyHearns.record[1].Type);
  // const regExp = /\(([^)]+)\)/;
  // const matchesReachTommy = regExp.exec(readableBoxerRecordTommyHearns.Reach);
  // const matchesHeightTommy = regExp.exec(readableBoxerRecordTommyHearns.Height);

  // const dateOfBirth = readableBoxerRecordTommyHearns?.Born;
  // const deathDate = readableBoxerRecordTommyHearns?.Died;
  // const matchesDateOfBirth = dateOfBirth?.match(/\(([^()]*)\)/);
  // const matchesDateOfDeath = deathDate?.match(/\(([^()]*)\)/);
  // const dateTimeFormat = new Date(matchesDateOfBirth);
  // let dateTimeFormatDeath = null;
  // if (matchesDateOfDeath) {
  //   dateTimeFormatDeath = new Date(matchesDateOfDeath);
  // }
  // for (var i = 0; i < tommyRecord.length; i++) {
  //   //console.log(tommyRecord[i]);
  //   for (record in tommyRecord[i]) {
  //     const Boxer = "Thomas Hearns";
  //     const Opponent = tommyRecord[i][record].Opponent;
  //     const boxers = [Boxer, Opponent];
  //     const Outcome = tommyRecord[i][record].Type;
  //     let winner = null;
  //     if (tommyRecord[i][record].Result === "Win\n") {
  //       winner = 560;
  //     } else {
  //       winner = 0;
  //     }
  //     const roundTime = tommyRecord[i][record].Round_Time;
  //     const date = tommyRecord[i][record].Date;
  //     const dateTimeFormat = new Date(date);
  //     const location = tommyRecord[i][record].Location;

  //     const notes = tommyRecord[i][record].Notes;
  //     if (notes) {
  //       matchNote = notes;
  //   }

  //console.log(roundTime);
  // console.log(
  //   boxers,
  //   Outcome,
  //   winner,
  //   roundTime,
  //   dateTimeFormat,
  //   location,
  //   matchNote
  // );
  //   const inserted = await prisma.fight.create({
  //     data: {
  //       boxers: {
  //         connect: {
  //           id: 665,
  //         },
  //       },

  //       winner: boxers.id,
  //       winnerId: boxers.id,
  //       outcome: Outcome,
  //       roundTime: roundTime,
  //       date: dateTimeFormat,
  //       location: location,
  //       notes: matchNote,
  //     },
  //   });
  //   console.log(inserted);
  // }
}

//seedChampions();
// const inserted = await prisma.boxer.create({
//   dataTommyHearns: {
//     boxers:readableBoxerRecordTommyHearns,
//     winner: readableBoxerRecordTommyHearns,
//     winnerId: null,
//     outcome: updatedHeight,
//     roundtimne: updatedReach,
//     date: dateTimeFormat,
//     location: dateTimeFormatDeath,
//     notes: updatedStance,
//   },
// });
//}

// {
//   "No": "67\n",
//   "Result": "Win\n",
//   "Record": "61–5–1\n",
//   "Opponent": "Shannon Landberg\n",
//   "Type": "TKO\n",
//   "Round_Time": "10 (10), 1:35\n",
//   "Date": "Feb 4, 2006\n",
//   "Location": "The Palace of Auburn Hills, Auburn Hills, Michigan, U.S.\n",
//   "Notes": "\n"
// }

//Step 0:Require JSON
//> Get the ID of main boxer from the database (ID 560)
//Step 1: Loop through the record,
//>for each fight check if the opponent is in database (No most opponenets are not)
//>If opponent is in database we get the ID
//>If the opponent is not in database we insert the opponent
//Step 2: Determine the winner ID
//>If it says win, in that case the winner ID is main boxer ID
//>If it says loss, then in that case winner ID is opponent ID
//If it says draw or anythings else, then value is null,
// Step 3: Determine the outcome
//>Store type

// Step 4: Determine the round time
//>Store round time

// Step 5: Determine the date
//>Store date of fight
//>might need to convert date, could use Date.parse

// Step 6: Determine the location and notes
//>venue is the location of the string
//> Notes is just notes

// model Fight {
//   id        Int     @id @default(autoincrement())
//   boxers    Boxer[]
//   winner    Boxer?  @relation("winner",fields: [winnerId], references: [id])
//   winnerId  Int?
//   outcome   String
//   roundTime String
//   date      DateTime  @db.Date
//   location  String
//   notes     String?

// }

//create: [
//     imageURL: readableBoxerRecordTommyHearns.imageUrl?.substring(2),
//     name: readableBoxerRecordTommyHearns?.name,
//     nickName: readableBoxerRecordTommyHearns["Nickname(s)"]
//       ?.trim()
//       ?.replaceAll("\n", ", "),
//     formerChampion: true,
//     height: matchesHeightTommy,
//     reach: matchesReachTommy,
//     born: dateTimeFormat,
//     died: dateTimeFormatDeath,
//     stance: updatedStance,
//     fights:    tommyRecord[i][record]
//     fightsWon
//     weightCategories WeightCategory[]

//seedChampions();

async function seedRecords() {
  let filePathTommyHearns = "boxers/Thomas_Hearns.json";
  const boxersRecordTommyHearns = fs.readFileSync(filePathTommyHearns);

  const readableBoxerRecordTommyHearns = JSON.parse(boxersRecordTommyHearns);
  const mainBoxer = await prisma.boxer.findUnique({
    where: {
      name: readableBoxerRecordTommyHearns.name,
    },
  });
  //console.log(mainBoxer.id);

  for (fight of readableBoxerRecordTommyHearns.record) {
    //console.log("name of the opponent", fight.Opponent.trim());
    const roundTime = fight.Round_Time;
    const date = fight.Date;
    const dateTimeFormat = new Date(date);
    const Outcome = fight.Type;
    const location = fight.Location;

    const notes = fight.Notes;
    //console.log(Outcome, roundTime, dateTimeFormat, location, notes);
    let opponentBoxer = await prisma.boxer.findUnique({
      where: {
        name: fight.Opponent.trim(),
      },
    });
    //console.log(fight.Result.trim());

    if (notes) {
      matchNote = notes;
    }

    trimmedResult = fight.Result.trim();
    let winnerID = null;
    let winnerName = null;

    if (trimmedResult === "Win") {
      winnerID = mainBoxer.id;
      winnerName = readableBoxerRecordTommyHearns.name;

      //   //console.log("Tommy won", winnerID, winnerName);
    } else if (trimmedResult === "Loss") {
      winnerID = opponentBoxer.id;
      winnerName = opponentBoxer.name;
      //   // console.log("Tommy lost", winnerID, winnerName);
    } else {
      //console.log("It is a draw", winnerID);
    }
    // console.log(notes);
    const insertedNameIDs = await prisma.fight.create({
      data: {
        boxers: {
          connect: {
            name: readableBoxerRecordTommyHearns.name,
            name: opponentBoxer.name,
          },

          //winner: winnerName,
        },
        winnerId: winnerID,
        outcome: Outcome,
        roundTime: roundTime,
        date: dateTimeFormat,
        location: location,
        notes: notes,
      },
    });
    console.log(insertedNameIDs);

    //console.log(opponentBoxer.id);
    // if (!opponentBoxer) {
    //   opponentBoxer = await prisma.boxer.create({
    //     data: {
    //       name: fight.Opponent.trim(),
    //       formerChampion: false,
    //     },
    //   });
    // }
    // console.log("logging opponet from DB", opponentBoxer);
  }
}
seedRecords();
