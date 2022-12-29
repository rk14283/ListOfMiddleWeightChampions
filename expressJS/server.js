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
app.get("/api/boxers/:name", async (request, response) => {
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

app.get("/api/boxers/:name/json", async (request, response) => {
  //I do not need number because it is already in number, but if I use number I get NAN
  //console.log("Hello");
  const allBoxerNames = await prisma.boxer.findMany({
    where: {
      formerChampion: true,
    },
    //this will send a json page
    // select: {
    //   name: true,
    //   id: true,
    //   imageURL: true,
    // },
  });
  response.send(allBoxerNames);
});

app.listen(9000, function () {
  console.log("heard on 9000");
});

//Further steps:
//Dropdown of all boxers, done before, can see a referenced video
//figure out what ID is doing
//When boxer is selected bring its imageURL
//Try two boxers
//work only with dropdown not click event
