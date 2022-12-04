const fs = require("fs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
let directroy = "boxers";
let files = fs.readdirSync(directroy);

for (var i = 0; i < files.length; i++) {
  files[i] = "boxers/" + files[i];
}

async function seed() {
  for (var i = 0; i < files.length; i++) {
    const boxersRecord = fs.readFileSync(files[i]);
    const readableBoxerRecord = JSON.parse(boxersRecord);

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

    // const inserted = await prisma.boxer.create({
    //   data: {
    //     imageURL: readableBoxerRecord.imageUrl?.substring(2),
    //     name: readableBoxerRecord?.name,
    //     nickName: readableBoxerRecord["Nickname(s)"]
    //       ?.trim()
    //       ?.replaceAll("\n", ", "),
    //     formerChampion: true,
    //     height: updatedHeight,
    //     reach: updatedReach,
    //     born: dateTimeFormat,
    //     died: dateTimeFormatDeath,
    //     stance: updatedStance,
    //   },
    // });
    // console.log(inserted);
  }
  //JSON file of tommy hearns, insert only tommy hearn's record
  let filePathTommyHearns = "boxers/Thomas_Hearns.json";

  const boxersRecordTommyHearns = fs.readFileSync(filePathTommyHearns);

  const readableBoxerRecordTommyHearns = JSON.parse(boxersRecordTommyHearns);
  //console.log(readableBoxerRecordTommyHearns);
  //console.log(readableBoxerRecordTommyHearns.record);

  const tommyRecord = [];
  tommyRecord.push(readableBoxerRecordTommyHearns.record);
  //console.log(readableBoxerRecordTommyHearns.record);

  //lastFight = tommyRecord[0][1];

  // console.log(lastFight.Type);
  //console.log(readableBoxerRecordTommyHearns.record[1].Type);
  const regExp = /\(([^)]+)\)/;
  const matchesReachTommy = regExp.exec(readableBoxerRecordTommyHearns.Reach);
  const matchesHeightTommy = regExp.exec(readableBoxerRecordTommyHearns.Height);

  const dateOfBirth = readableBoxerRecordTommyHearns?.Born;
  const deathDate = readableBoxerRecordTommyHearns?.Died;
  const matchesDateOfBirth = dateOfBirth?.match(/\(([^()]*)\)/);
  const matchesDateOfDeath = deathDate?.match(/\(([^()]*)\)/);
  const dateTimeFormat = new Date(matchesDateOfBirth);
  let dateTimeFormatDeath = null;
  if (matchesDateOfDeath) {
    dateTimeFormatDeath = new Date(matchesDateOfDeath);
  }
  for (var i = 0; i < tommyRecord.length; i++) {
    //console.log(tommyRecord[i]);
    for (record in tommyRecord[i]) {
      const Boxer = "Thomas Hearns";
      const Opponent = tommyRecord[i][record].Opponent;
      const boxers = [Boxer, Opponent];
      const Outcome = tommyRecord[i][record].Type;
      let winner = null;
      if (tommyRecord[i][record].Result === "Win\n") {
        winner = Boxer;
      } else {
        winner = Opponent;
      }
      const roundTime = tommyRecord[i][record].Round_Time;
      const date = tommyRecord[i][record].Date;
      const location = tommyRecord[i][record].location;

      const notes = tommyRecord[i][record].Notes;

      //console.log(boxers, Outcome, winner, roundTime, date, location, notes);
      const inserted = await prisma.fight.create({
        data: {
          imageURL: readableBoxerRecordTommyHearns.imageUrl?.substring(2),
          name: readableBoxerRecordTommyHearns?.name,
          nickName: readableBoxerRecordTommyHearns["Nickname(s)"]
            ?.trim()
            ?.replaceAll("\n", ", "),
          formerChampion: true,
          height: matchesHeightTommy,
          reach: matchesReachTommy,
          born: dateTimeFormat,
          died: dateTimeFormatDeath,
          stance: updatedStance,

          Opponent,

          winner: winner,
          winnerId: null,
          outcome: Outcome,
          roundtimne: roundTime,
          date: date,
          location: location,
          notes: notes,
        },
      });
      console.log(inserted);
    }
  }
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
}

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

//Step 0: Get the ID of main boxer from the database
//Step 1: check if the opponent is in database
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

seed();
