var express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
var bodyParser = require("body-parser");
var cors = require("cors");
var path = require("path");
var app = express();
app.use(bodyParser.json());

//var expressLayouts = require("express-ejs-layouts");
app.use(express.urlencoded({ extended: true }));

app.use(cors());
//app.use(expressLayouts);
//provides the engine
app.set("view engine", "ejs");
//provides the directory
app.set("views", path.join(__dirname, "./views"));
//console.log(__dirname);

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
  //console.log(boxerNames);
  response.render("templates", { boxerNames: boxerNames });
});

app.get("/api/simulatefight/:id1/:id2", async (request, response) => {
  //: is when you are defining parameters, but do not put colon in templates
  let mainBoxerId = parseInt(request.params.id1);
  let opponentBoxerId = parseInt(request.params.id2);

  //console.log("This is my name", mainBoxerName);
  // common becomes function, unique becomes parameter, remember to return the value
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
  // console.log(championsBeatenByMainBoxerNumber);
  let mainBoxerName = championsBeatenByMainBoxer.name;

  let championsBeatenByOpponentBoxer = await getBoxerRecord(opponentBoxerId);
  let championsBeatenByOpponentBoxerNumber =
    championsBeatenByOpponentBoxer.fightsWon.length;

  let opponentBoxerName = championsBeatenByOpponentBoxer.name;

  let outcomeText = null;
  if (championsBeatenByMainBoxerNumber > championsBeatenByOpponentBoxerNumber) {
    //outcomeText = mainBoxerName + " " + "won";
    outcomeText = mainBoxerName;
  } else if (
    championsBeatenByMainBoxerNumber < championsBeatenByOpponentBoxerNumber
  ) {
    //outcomeText = opponentBoxerName + " " + "won";
    outcomeText = opponentBoxerName;
  } else {
    //outcomeText = "It is a draw";
  }
  response.send(outcomeText);
});

app.get("/api/boxers/:id/json", async (request, response) => {
  // console.log("these are params", request.params.id);

  let boxerId = parseInt(request.params.id);

  //console.log("this is boxer id", boxerId);

  let oneBoxerInfo = await prisma.boxer.findUnique({
    where: {
      id: boxerId,
    },
  });

  response.send(oneBoxerInfo);
});

app.listen(9000, function () {
  console.log("heard on 9000");
});
