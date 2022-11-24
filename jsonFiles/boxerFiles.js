const fs = require("fs");
filenames = fs.readdirSync(__boxers);

console.log(filenames);

console.log("\nCurrent directory filenames:");
filenames.forEach((file) => {
  console.log(file);
});

fileObjs = fs.readdirSync(__boxers, { withFileTypes: true });

console.log("\nCurrent directory files:");
fileObjs.forEach((file) => {
  console.log(file);
});
