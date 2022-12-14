const fs = require("fs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
let directroy = "boxers";
let files = fs.readdirSync(directroy);

for (var i = 0; i < files.length; i++) {
  files[i] = "boxers/" + files[i];
}

async function seedChampions() {
  for (var i = 0; i < files.length; i++) {
    const boxersRecord = fs.readFileSync(files[i]);
    const readableBoxerRecord = JSON.parse(boxersRecord);

    const boxerName = readableBoxerRecord.name?.trim();

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
        name: boxerName,
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
}

//seedChampions();

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

async function seedRecords() {
  let directroy = "boxers";
  let files = fs.readdirSync(directroy);
  for (var i = 0; i < files.length; i++) {
    files[i] = "boxers/" + files[i];
    const boxerData = fs.readFileSync(files[i]);
    const boxer = JSON.parse(boxerData);
    for (fight of boxer.record) {
      try {
        const roundTime = fight.Round_Time;
        const date = fight.Date;
        const dateTimeFormat = new Date(date);
        const outcome = fight.Type;
        const location = fight.Location;

        const notes = fight.Notes;
        const trimmedResult = fight.Result?.trim();

        let mainBoxer = await prisma.boxer.findUnique({
          where: {
            name: boxer.name.trim(),
          },
        });
        let opponent = await prisma.boxer.findUnique({
          where: {
            name: fight.Opponent.trim(),
          },
        });
        if (!opponent) {
          opponent = await prisma.boxer.create({
            data: {
              name: fight.Opponent.trim(),
              formerChampion: false,
            },
          });
        }
        //1:look inside database for fight with same boxers and the same date
        let duplicateFight = await prisma.fight.findFirst({
          where: {
            boxers: {
              every: {
                //where all ids are in this array
                id: { in: [mainBoxer.id, opponent.id] },
              },
            },
            date: dateTimeFormat,
          },
        });

        //console.log(matchDate);
        // console.log(duplicateFight);

        if (duplicateFight) {
          console.log("duplicate");
          continue;
        }
        //2: If this fight exists we continue

        let winnerID = null;
        let winnerName = null;
        if (trimmedResult === "Win") {
          winnerID = mainBoxer.id;
          winnerName = mainBoxer.name;
        } else if (trimmedResult === "Loss") {
          winnerID = opponent.id;
          winnerName = opponent.name;
        }
        console.log(
          "This is main boxer name",
          mainBoxer.name,
          "This is the opponent name",
          opponent.name
        );
        const insertedNameIDs = await prisma.fight.create({
          data: {
            boxers: {
              connect: [
                {
                  name: mainBoxer.name,
                },
                {
                  name: opponent.name,
                },
              ],
            },
            winnerId: winnerID,
            outcome: outcome,
            roundTime: roundTime,
            date: dateTimeFormat,
            location: location,
            notes: notes,
          },
        });
        //console.log(insertedNameIDs);
      } catch (error) {
        console.log(error, "This entry did not work", fight);
      }
    }
  }
}
seedRecords();

//Problem with seeding weight is that opponent does not always have a weight
