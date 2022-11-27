const fs = require("fs");

const { PrismaClient } = require("@prisma/client");
const { Z_DATA_ERROR } = require("zlib");

const prisma = new PrismaClient();
//fs.readdirSync(path1[,optins],callback)

let directroy = "boxers";
filePathTommyHearns = "boxers/Thomas_Hearns.json";

let files = fs.readdirSync(directroy);
////read file for one boxer
let data = fs.readFileSync(filePathTommyHearns);

for (var i = 0; i < files.length; i++) {
  files[i] = "boxers/" + files[i];
}
//console.log(files);

// let newData = fs.readFileSync(files[0]);
// console.log(newData);
////This worked
// var array = fs
//   .readFileSync("boxers/" + files[0])
//   .toString()
//   .split("\n");
// for (i in array) {
//   console.log(array[i]);
// }

// //console.log(files[file]);

async function seed() {
  const boxers = [];

  for (var i = 0; i < files.length; i++) {
    const boxersRecord = fs.readFileSync(files[i]);
    //console.log(boxersRecord.toString("utf-8"));
    readableBoxerRecord = JSON.parse(boxersRecord);
    var matchesHeight = readableBoxerRecord.Height;
    var regExp = /\(([^)]+)\)/;
    var matchesHeight = regExp.exec(readableBoxerRecord.Height);
    console.log(matchesHeight);
  }

  //console.log(readableBoxerRecord);
  //console.log(inserted);
}

seed();

////file sync for 1 boxer
// async function seed() {
//   //console.log("hello");
//   //get an array of json fi
//   //console.log(files.length);
//   const boxersRecord = fs.readFileSync(files[0]);
//   //console.log(boxer);
//   ////this works don't fiddle with it too much
//   var Data = boxersRecord.toString("utf-8");
//   console.log(Data);
// }

// seed();
