const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seed() {
  console.log("hello");
  //get an array of json fi
  const boxer = require("../../boxers/Thomas_Hearns.json");
  //console.log(boxer);
  var regExp = /\(([^)]+)\)/;
  var matchesHeight = regExp.exec(boxer.Height);
  var matchesReach = regExp.exec(boxer.Reach);

  const dateOfBirth = boxer.Born;
  matchesDateOfBirth = dateOfBirth.match(/\(([^()]*)\)/)[1];
  dateTimeFormat = new Date(matchesDateOfBirth);
  //console.log(dateTimeFormat);

  const inserted = await prisma.boxer.create({
    data: {
      imageURL: boxer.imageUrl?.substring(2),
      name: boxer.name,
      nickName: boxer["Nickname(s)"]?.trim()?.replaceAll("\n", ", "),
      height: parseInt(matchesHeight[1]),
      reach: parseInt(matchesReach[1]),
      born: dateTimeFormat,
      died: null,
      stance: boxer.Stance,
    },
  });
  console.log(inserted);
}

seed();
