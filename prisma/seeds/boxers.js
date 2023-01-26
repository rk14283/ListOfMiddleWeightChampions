//importing libraries, prisma, filesync, and directory of boxers
const fs = require("fs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
let directroy = "boxers";
let files = fs.readdirSync(directroy);
//loop to add correct file location
for (var i = 0; i < files.length; i++) {
  files[i] = "boxers/" + files[i];
}

//function to seed wikipedia infoBox of middleweightChampions
async function seedChampions() {
  //loop to read through JSON files
  for (var i = 0; i < files.length; i++) {
    //reads JSON from file turning it to js object
    const boxersRecord = fs.readFileSync(files[i]);
    const readableBoxerRecord = JSON.parse(boxersRecord);

    //removes white space or other characters, returns only name
    const boxerName = readableBoxerRecord.name?.trim();

    //if there is a stance in the infobox it assigns it to a variable updatedStance
    let updatedStance = null;
    if (readableBoxerRecord.Stance) {
      updatedStance = readableBoxerRecord.Stance;
    }
    //regex for the variables for them to fit to schema
    const regExp = /\(([^)]+)\)/;
    //regex to make height and reach from infobox readable
    const matchesReach = regExp.exec(readableBoxerRecord.Reach);
    const matchesHeight = regExp.exec(readableBoxerRecord.Height);
    //initializing height value to o
    let updatedHeight = 0;

    //here if there is height in infobox then execute the below
    if (readableBoxerRecord.Height && matchesHeight != null) {
      //then height is converted to integer
      updatedHeight = parseInt(matchesHeight[1]);
      //if the height is greater than 0 or less than 10 then it is normalized by multiplying it with ten
      if (updatedHeight > 0 && updatedHeight < 10) {
        updatedHeight = updatedHeight * 10;
      }
    }

    //initializing value of reach to 0
    let updatedReach = 0;
    //if there is reach in infobox then execute the below
    if (readableBoxerRecord.Reach && matchesReach) {
      //here if there is cm then it converts it to integer
      if (matchesReach[1].includes("cm")) {
        updatedReach = parseInt(matchesReach[1]);
        //if height is not in cm then it is converted to floating point, multiplied to 100 and then rounded off
      } else {
        updatedReach = parseFloat(matchesReach[1]) * 100;
        updatedReach = Math.floor(updatedReach);
      }
      //if reach is greater than 200 then it is normalized by dividing by 100 and multiplying with 2.54 because it is inches
      if (updatedReach > 200) {
        updatedReach = Math.floor((updatedReach / 100) * 2.54);
      }
    }

    //declaring variables of date of birth and date if they exist in infoBox
    const dateOfBirth = readableBoxerRecord?.Born;
    const deathDate = readableBoxerRecord?.Died;
    //date of birth and date if exist must match regex format
    const matchesDateOfBirth = dateOfBirth?.match(/\(([^()]*)\)/);
    const matchesDateOfDeath = deathDate?.match(/\(([^()]*)\)/);
    //converts date of birth from string to date time format
    const dateTimeFormat = new Date(matchesDateOfBirth);
    //declaring a new variable for date of death
    let dateTimeFormatDeath = null;
    //if there is date of death in infobox then execute the if statement
    if (matchesDateOfDeath) {
      //date of death is converted to date time format
      dateTimeFormatDeath = new Date(matchesDateOfDeath);
    }
    //declaring an object inserted which would insert a boxer onto boxer's table through Prisma
    const inserted = await prisma.boxer.create({
      //data object
      data: {
        //grab imageURL if it exists take part of the string it starts at index 2, we are chopping off /
        imageURL: readableBoxerRecord.imageUrl?.substring(2),
        //name has value boxerName
        name: boxerName,
        //grabs nickName if it exits trims whitespace and removes \n
        nickName: readableBoxerRecord["Nickname(s)"]
          ?.trim()
          ?.replaceAll("\n", ", "),
        //former champion has boolean true, if it is in this dataset then it is always a champion
        formerChampion: true,
        //height has value of updatedHeight
        height: updatedHeight,
        //reach gets value of variable updatedReach
        reach: updatedReach,
        //born gets value of of variable dateTimeFormat
        born: dateTimeFormat,
        //died gets value of variable to dateTimeFormat
        died: dateTimeFormatDeath,
        //stance get value of variable updatedStance
        stance: updatedStance,
      },
    });
    //object of inserted is printed to console
    console.log(inserted);
  }
}

//seedChampions();

//This function seeds record of individual boxer
async function seedRecords() {
  //variable of directory get value of boxers
  let directroy = "boxers";
  //files uses readdirSync function and returns and array with filenames
  let files = fs.readdirSync(directroy);
  //loop to read files and convert JSON values to JS object
  for (var i = 0; i < files.length; i++) {
    files[i] = "boxers/" + files[i];
    const boxerData = fs.readFileSync(files[i]);
    const boxer = JSON.parse(boxerData);
    //loop to read an array record and one element is a fight
    for (fight of boxer.record) {
      //we use try here because the boxer records are incomplete or do not match the schema, without try if there is one bad record program would stop
      try {
        //variables reading value from object fight,
        const roundTime = fight.Round_Time;
        const date = fight.Date;
        //date converted to dateTimeFormat
        const dateTimeFormat = new Date(date);
        const outcome = fight.Type;
        const location = fight.Location;

        const notes = fight.Notes;
        //trims whitespace from result if result exists
        const trimmedResult = fight.Result?.trim();
        //declaring a variable mainBoxer and assigning it to value of a boxer using database query findUnique
        let mainBoxer = await prisma.boxer.findUnique({
          where: {
            //name is assigned the value of boxer.name from boxer object and white space is trimmed
            name: boxer.name.trim(),
          },
        });
        //declaring variable opponent and assigning it to value of a boxer using SQL query findUnique
        let opponent = await prisma.boxer.findUnique({
          where: {
            //name is assigned value of opponent which it gets from fight object and whitespace is trimmed
            name: fight.Opponent.trim(),
          },
        });
        //if there is no opponent then execute the if statement
        if (!opponent) {
          // we upload opponent if it is not already in the database
          opponent = await prisma.boxer.create({
            data: {
              //name gets value of opponent and white space is trimmed
              name: fight.Opponent.trim(),
              //here the opponent is not a former champion because we have already inserted champions
              formerChampion: false,
            },
          });
        }
        //1:look inside database for fight with same boxers and the same date
        //removes duplicate fights using database query findFirst on object fight (findFirst finds first fight that matches the condition)
        let duplicateFight = await prisma.fight.findFirst({
          where: {
            boxers: {
              //it tries to find fights where the same mainBoxer and opponent have fought and the date of the fight is the same
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

        //if duplicate fight is found then log to console duplicate and continue executing rest of the code without insert the fight
        if (duplicateFight) {
          console.log("duplicate");
          continue;
        }
        //2: If this fight is a duplicate we skip this iteration of loop
        //declaring values winnerID and name and initializing it to null
        let winnerID = null;
        let winnerName = null;
        //if result of the fight is win
        if (trimmedResult === "Win") {
          //then winnerID and WinnerName get the value and ID of main boxer
          winnerID = mainBoxer.id;
          winnerName = mainBoxer.name;
          //if result of the fight is loss
        } else if (trimmedResult === "Loss") {
          //then winnerID and WinnerName get the name and ID of opponent boxer
          winnerID = opponent.id;
          winnerName = opponent.name;
        }
        console.log(
          //logging main boxer name and opponent boxer name
          "This is main boxer name",
          mainBoxer.name,
          "This is the opponent name",
          opponent.name
        );
        //declaring variable insertedNameIDs and inserting into database using database query create
        const insertedNameIDs = await prisma.fight.create({
          //object data
          data: {
            boxers: {
              //what is connect doing here
              connect: [
                {
                  name: mainBoxer.name,
                },
                {
                  name: opponent.name,
                },
              ],
            },
            //values of data object which includes winnerID, Outcome of fight, roundTime, date, location and notes
            winnerId: winnerID,
            outcome: outcome,
            roundTime: roundTime,
            date: dateTimeFormat,
            location: location,
            notes: notes,
          },
        });
        //console.log(insertedNameIDs);
        //this catches the entries or fight objects that were not inserted due to some error, and prints to console
      } catch (error) {
        console.log(error, "This entry did not work", fight);
      }
    }
  }
}
//seedRecords();

//Problem with seeding weight is that opponent does not always have a weight
