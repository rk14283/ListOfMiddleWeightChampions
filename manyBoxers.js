const fs = require("fs");
//fs.readdirSync(path1[,optins],callback)

//folder path to read contents
let directroy = "boxers";

fs.readdir(directroy, readdirCallback);

function readdirCallback(error, files) {
  if (error) {
    console.log("Error in reading contents...");
    console.log(error.message);
  } else {
    console.log("Contents are....");
    console.log(files);
  }
}
