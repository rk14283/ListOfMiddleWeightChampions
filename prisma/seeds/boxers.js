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
    const Height = readableBoxerRecord.Height;
    const Reach = readableBoxerRecord.Reach;

    const regExp = /\(([^)]+)\)/;
    ///Todo applyRegex to height
    const matchesReach = regExp.exec(readableBoxerRecord.Reach);
    const matchesHeight = regExp.exec(readableBoxerRecord.Height);
    //const reachInt = parseInt(matchesReach);
    //console.log(typeof matchesReach);

    console.log("this is height", matchesHeight[1]);
    //5

    function removeByIndex(str, index) {
      return str.slice(0, index) + str.slice(index + 1);
    }
    const updatedReach = removeByIndex(matchesReach[1], 5);
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
        height: parseInt(matchesHeight[1]),
        reach: parseInt(updatedReach),
        born: dateTimeFormat,
        died: dateTimeFormatDeath,
        stance: readableBoxerRecord.Stance,
      },
    });
    console.log(inserted);
  }
}

seed();
