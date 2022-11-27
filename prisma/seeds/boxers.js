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
    readableBoxerRecord = JSON.parse(boxersRecord);
    var matchesHeight = readableBoxerRecord.Height;
    var regExp = /\(([^)]+)\)/;
    var matchesReach = regExp.exec(readableBoxerRecord.Reach);

    const dateOfBirth = readableBoxerRecord?.Born;
    const deathDate = readableBoxerRecord?.Died;
    //console.log(dateOfBirth);
    // console.log(deathDate);
    matchesDateOfBirth = dateOfBirth?.match(/\(([^()]*)\)/);
    matchesDateOfDeath = deathDate?.match(/\(([^()]*)\)/);
    //console.log(matchesDateOfDeath);
    dateTimeFormat = new Date(matchesDateOfBirth);
    if (matchesDateOfDeath) {
      dateTimeFormatDeath = new Date(matchesDateOfDeath);
    }
    //console.log(matchesHeight);
    //console.log(dateTimeFormat);
    //console.log(dateTimeFormatDeath);
  }
  const inserted = await prisma.readableBoxerRecord?.create({
    data: {
      imageURL: readableBoxerRecord.imageUrl?.substring(2),
      name: readableBoxerRecord?.name,
      nickName: readableBoxerRecord["Nickname(s)"]
        ?.trim()
        ?.replaceAll("\n", ", "),
      height: parseInt(matchesHeight[1]),
      reach: parseInt(matchesReach[1]),
      born: dateTimeFormat,
      died: dateTimeFormatDeath,
      stance: readableBoxerRecord.Stance,
    },
  });
  console.log(inserted);
}

seed();
