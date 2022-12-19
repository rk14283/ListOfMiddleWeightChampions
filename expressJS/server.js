var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var path = require("path");
var app = express();
var directory =
  "/home/rohan/Documents/listOfMiddleWeightChampions/expressJS/views.ejs";
//var expressLayouts = require("express-ejs-layouts");
app.use(express.urlencoded({ extended: true }));

app.use(cors());
//app.use(expressLayouts);
//provides the engine
app.set("view engine", "ejs");
//provides the directory
app.set("views", directory);

app.get("/", function (request, response) {
  response.render("templates");
});

app.listen(9000, function () {
  console.log("heard on 9000");
});
