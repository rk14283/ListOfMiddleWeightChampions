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
  //right now I need to log both the ids
  //: is when you are defining parameters, but do not put colon in templates
  let mainBoxerId = parseInt(request.params.id1);
  let opponentBoxerId = parseInt(request.params.id2);

  //console.log(mainBoxerId);
  //console.log(opponentBoxerId);
  //query how many champions boxer 1 beat
  let mainBoxerData = await prisma.boxer.findUnique({
    where: {
      id: mainBoxerId,
    },
  });
  // console.log(mainBoxerData);
  let mainBoxerName = mainBoxerData.name;
  //console.log("This is my name", mainBoxerName);
  let mainBoxerRecordById = await prisma.boxer.findUnique({
    where: {
      id: mainBoxerId,
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
  // console.log(mainBoxerRecordById);
  let championsBeatenByMainBoxer = mainBoxerRecordById.fightsWon.length;
  //console.log("This is how many champions sugar ray beat",championsBeatenByMainBoxer)
  //query how many champions boxer 2 beat
  let opponentBoxerData = await prisma.boxer.findUnique({
    where: {
      id: opponentBoxerId,
    },
  });
  //console.log(opponentBoxerData);
  let opponentBoxerName = opponentBoxerData.name;
  //console.log("This is my name", opponentBoxerName);
  let opponentBoxerRecordById = await prisma.boxer.findUnique({
    where: {
      id: opponentBoxerId,
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
  //  console.log(opponentBoxerRecordById);
  let championsBeatenByOpponentBoxer = opponentBoxerRecordById.fightsWon.length;
  //console.log("This is how many champions tommy beat",championsBeatenByOpponentBoxer)
  //compute the difference
  //based on who has higher champions beaten either id 1 won, id2 won or it was a draw

  let outcomeText = null;
  if (championsBeatenByMainBoxer > championsBeatenByOpponentBoxer) {
    outcomeText = mainBoxerName + " " + "won";
  } else if (championsBeatenByMainBoxer < championsBeatenByOpponentBoxer) {
    outcomeText = opponentBoxerName + " " + "won";
  } else {
    outcomeText = "It is a draw";
  }
  //console.log(outcomeText);
  //send response to front end who won
  response.send(outcomeText);
  //show who won in front end in some way
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
