var express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
var bodyParser = require("body-parser");
var cors = require("cors");
var path = require("path");
var app = express();
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));

app.get("/boxers", async (request, response) => {
  const boxerNames = await prisma.boxer.findMany({
    where: {
      formerChampion: true,
    },
    select: {
      name: true,
      id: true,
    },
  });

  response.render("templates", { boxerNames: boxerNames });
});

app.get("/", async (request, response) => {
  const boxerNames = await prisma.boxer.findMany({
    where: {
      formerChampion: true,
    },
    select: {
      name: true,
      id: true,
    },
  });
  response.render("templates", { boxerNames: boxerNames });
});

app.get("/api/simulatefight/:id1/:id2", async (request, response) => {
  let mainBoxerId = request.params.id1;
  let opponentBoxerId = request.params.id2;

  async function getBoxerRecord(boxerId) {
    let boxerRecord = await prisma.boxer.findUnique({
      where: {
        id: boxerId,
      },
      include: {
        fightsWon: {
          where: {
            boxers: {
              every: {
                formerChampion: true,
              },
            },
          },
        },
      },
    });
    return boxerRecord;
  }

  let championsBeatenByMainBoxer = await getBoxerRecord(mainBoxerId);

  let championsBeatenByMainBoxerNumber =
    championsBeatenByMainBoxer.fightsWon.length;
  let mainBoxerName = championsBeatenByMainBoxer.name;

  let championsBeatenByOpponentBoxer = await getBoxerRecord(opponentBoxerId);
  let championsBeatenByOpponentBoxerNumber =
    championsBeatenByOpponentBoxer.fightsWon.length;

  let opponentBoxerName = championsBeatenByOpponentBoxer.name;

  let outcomeText = null;
  if (championsBeatenByMainBoxerNumber > championsBeatenByOpponentBoxerNumber) {
    outcomeText = mainBoxerName;
  } else if (
    championsBeatenByMainBoxerNumber < championsBeatenByOpponentBoxerNumber
  ) {
    outcomeText = opponentBoxerName;
  } else {
  }
  response.send(outcomeText);
});

app.get("/api/simulatefight/:id1/:id2/realLife", async (request, response) => {
  let mainBoxerId = request.params.id1;
  let opponentBoxerId = request.params.id2;
  async function queryingFightAgainstBoxerInRealLife() {
    let oneBoxerName = await prisma.boxer.findUnique({
      where: {
        id: mainBoxerId,
      },
    });

    let oneBoxerId = mainBoxerId;

    //challenging part, querying the opponenets

    //FindMany returns whole record, findUnique error,and findFrist returns first record
    let boxerRecord = await prisma.boxer.findUnique({
      where: {
        id: oneBoxerId,
      },
      //This code returned Hagler's record
      include: {
        fights: {
          where: {
            boxers: {
              //every does not work, but works when used with two ids
              every: {
                //Findfirst and FindUnique returns same result but findmany returns an object or objects
                id: {
                  in: [oneBoxerId, opponentBoxerId],
                },
              },
            },
          },
        },
      },
    });
    let foungtInRealLifeTime = boxerRecord.fights.length;
    //console.log(foungtInRealLifeTime);
    let winnerIDs = [];
    for (var i = 0; i < boxerRecord.fights.length; i++) {
      //console.log(boxerRecord.fights[i].winnerId);
      winnerIDs.push(boxerRecord.fights[i].winnerId);
    }

    //console.log(winnerIDs.length);
    return winnerIDs;
  }

  queryingFightAgainstBoxerInRealLife();

  let foughtInRealLifeArray = await queryingFightAgainstBoxerInRealLife();

  let NumberOfTimesFought = foughtInRealLifeArray.length;
  response.send(foughtInRealLifeArray);
});

app.get("/api/boxers/:id/json", async (request, response) => {
  let boxerId = request.params.id;

  let oneBoxerInfo = await prisma.boxer.findUnique({
    where: {
      id: boxerId,
    },
  });

  response.send(oneBoxerInfo);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server listening on http://localhost:" + PORT);
});
