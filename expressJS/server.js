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
  let mainBoxerId = parseInt(request.params.id1);
  let opponentBoxerId = parseInt(request.params.id2);

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

app.get("/api/boxers/:id/json", async (request, response) => {
  let boxerId = parseInt(request.params.id);

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
