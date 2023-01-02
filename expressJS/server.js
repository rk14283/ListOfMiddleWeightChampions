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
  //console.log(boxerNames);
});

// app.get("/api/boxers/:id", async (request, response) => {
//   //I do not need number because it is already in number, but if I use number I get NAN
//   //console.log("Hello");
//   const boxerName = await prisma.boxer.findUniqueOrThrow({
//     where: { id: Number(request.params.id) },
//   });
//   console.log(boxerName);
//   response.json(boxerName);
// });
app.get("/", async (request, response) => {
  //I do not need number because it is already in number, but if I use number I get NAN
  //console.log("Hello");
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

app.get("/api/boxers/:id/json", async (request, response) => {
  //I do not need number because it is already in number, but if I use number I get NAN
  console.log("these are params", request.params.id);
  //step 1: request params id to a number
  let boxerId = parseInt(request.params.id);
  //step 2: use this number
  //step 3: check if the matches
  console.log("this is boxer id", boxerId);

  //step 5: display the boxer

  let oneBoxerInfo = await prisma.boxer.findUnique({
    where: {
      id: boxerId,
    },
  });
  //response.json(oneBoxerInfo);
  //step 4: send a response
  response.send(oneBoxerInfo);
  //console.log(oneBoxerInfo);
});

app.listen(9000, function () {
  console.log("heard on 9000");
});
