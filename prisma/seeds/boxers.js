const fs = require("fs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
let directroy = "boxers";
let files = fs.readdirSync(directroy);

for (var i = 0; i < files.length; i++) {
  files[i] = "boxers/" + files[i];
}

async function seed() {
  //console.log("hello");
  //get an array of json fi

  for (var i = 0; i < files.length; i++) {
    //const boxer = require("../../boxers/Thomas_Hearns.json");
    //console.log(boxer);
    const boxersRecord = fs.readFileSync(files[i]);

    const readableBoxerRecord = JSON.parse(boxersRecord);

    if (readableBoxerRecord.Stance) {
      updatedStance = readableBoxerRecord.Stance;
    }
    const Height = readableBoxerRecord.Height;
    const Reach = readableBoxerRecord.Reach;
    const regExp = /\(([^)]+)\)/;
    ///Todo applyRegex to height
    const matchesReach = regExp.exec(readableBoxerRecord.Reach);
    const matchesHeight = regExp.exec(readableBoxerRecord.Height);
    //const reachInt = parseInt(matchesReach);
    //console.log(typeof matchesReach);

    //console.log("this is height", matchesHeight[1]);
    //console.log("this is Reach", Reach);
    //console.log("this is Reach", matchesReach);
    //5
    let updatedHeight = 0;

    if (readableBoxerRecord.Height && matchesHeight != null) {
      // if (matchesHeight[1].includes("cm")) {
      //   updatedHeight = parseInt(matchesHeight[1]);
      // } else {
      //   updatedHeight = parseFloat(matchesHeight[1]) * 100;
      //   updatedHeight = Math.floor(updatedHeight);
      // }
      updatedHeight = parseInt(matchesHeight[1]);
      // console.log(updatedHeight);
      if (updatedHeight > 0 && updatedHeight < 10) {
        updatedHeight = updatedHeight * 10;
      }
      //console.log(updatedHeight);
    }

    let updatedReach = 0;
    if (readableBoxerRecord.Reach && matchesReach) {
      function removeByIndex(str, index) {
        return str.slice(0, index) + str.slice(index + 1);
      }
      // const updatedReach = removeByIndex(matchesReach[1], 5);
      if (matchesReach[1].includes("cm")) {
        updatedReach = parseInt(matchesReach[1]);
      } else {
        updatedReach = parseFloat(matchesReach[1]) * 100;
        updatedReach = Math.floor(updatedReach);
      }
      if (updatedReach > 200) {
        //there are 7 such cases
        //console.log("SOMETHING WENT WRONG", updatedReach);
        updatedReach = Math.floor((updatedReach / 100) * 2.54);
        //console.log("NUMBER:", updatedReach);
      }
      // console.log("NUMBER:", updatedReach);
    }

    // function removeByIndex(str, index) {
    //   return str.slice(0, index) + str.slice(index + 1);
    // }
    // const updatedReach = removeByIndex(matchesReach[1], 5);
    //console.log("this is reach", updatedReach);
    // console.log("this is reach", matchesReach[1].split(5));
    const dateOfBirth = readableBoxerRecord?.Born;
    const deathDate = readableBoxerRecord?.Died;
    //console.log(dateOfBirth);
    // console.log(deathDate);
    const matchesDateOfBirth = dateOfBirth?.match(/\(([^()]*)\)/);
    const matchesDateOfDeath = deathDate?.match(/\(([^()]*)\)/);
    //console.log(matchesDateOfDeath);
    const dateTimeFormat = new Date(matchesDateOfBirth);
    let dateTimeFormatDeath = null;
    if (matchesDateOfDeath) {
      dateTimeFormatDeath = new Date(matchesDateOfDeath);
    }
    //console.log(matchesHeight);
    //console.log(dateTimeFormat);
    //console.log(dateTimeFormatDeath);

    const inserted = await prisma.boxer.create({
      data: {
        imageURL: readableBoxerRecord.imageUrl?.substring(2),
        name: readableBoxerRecord?.name,
        nickName: readableBoxerRecord["Nickname(s)"]
          ?.trim()
          ?.replaceAll("\n", ", "),
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

seed();
