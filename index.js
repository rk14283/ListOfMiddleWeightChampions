const axios = require("axios");
const { JSDOM } = require("jsdom");
const fs = require("fs");

function findRecordTable(tables) {
  //this function returns table with th
  for (table of tables) {
    const headings = table.querySelectorAll("th");
    for (heading of headings) {
      //getting the table with No. and there is only 1
      if (heading.textContent.includes("No.")) {
        return table;
      }
    }
  }
  return null;
}

function parseMatchRow(row, headings) {
  if (headings.textContent[57] == "A") {
    const [
      Number,
      Result,
      Record,
      Opponent,
      Type,
      RoundTime,
      Date,
      Age,
      Location,
      Notes,
    ] = row.querySelectorAll("td");

    const serialNumber = Number?.textContent;
    const fightResult = Result?.textContent;
    const tally = Record?.textContent;
    const foughtAgainst = Opponent?.textContent;
    const winType = Type?.textContent;
    const endRound = RoundTime?.textContent;
    const fightDate = Date?.textContent;
    const fighterAge = Age?.textContent;
    const fightLocation = Location?.textContent;
    const remarks = Notes?.textContent;

    const boxerRecord = {
      No: serialNumber,
      Result: fightResult,
      Record: tally,
      Opponent: foughtAgainst,
      Type: winType,
      Round_Time: endRound,
      Date: fightDate,
      Age: fighterAge,
      Location: fightLocation,
      Notes: remarks,
    };

    return boxerRecord;
  } else {
    const [
      Number,
      Result,
      Record,
      Opponent,
      Type,
      RoundTime,
      Date,
      Location,
      Notes,
    ] = row.querySelectorAll("td");

    const serialNumber = Number?.textContent;
    const fightResult = Result?.textContent;
    const tally = Record?.textContent;
    const foughtAgainst = Opponent?.textContent;
    const winType = Type?.textContent;
    const endRound = RoundTime?.textContent;
    const fightDate = Date?.textContent;
    const fightLocation = Location?.textContent;
    const remarks = Notes?.textContent;
    const boxerRecord = {
      No: serialNumber,
      Result: fightResult,
      Record: tally,
      Opponent: foughtAgainst,
      Type: winType,
      Round_Time: endRound,
      Date: fightDate,
      // Age: fighterAge,
      Location: fightLocation,
      Notes: remarks,
    };
    return boxerRecord;
  }
}

function parseInfoBox(infoboxTable) {
  if (!infoboxTable) return {};

  const imageBox = infoboxTable.querySelector(".infobox-image");
  const imageUrl = imageBox?.querySelector("img")?.src;

  // reach etc.. other stuff from infobox

  return { imageUrl: imageUrl };
}

async function scrapeRecordTable(url) {
  console.log("URL", url);
  const response = await axios.get(url);
  const html = response.data;
  const jsdom = new JSDOM(html);
  const document = jsdom.window.document;
  const fighterName = document
    .querySelector("h1")
    .textContent.replace(" (boxer)", "");

  const infoboxTable = document.querySelector(".infobox");
  const fighterInfo = parseInfoBox(infoboxTable);
  console.log(fighterInfo);

  //Parse the record
  const tables = document.querySelectorAll("table");
  let fightingRecordTable = findRecordTable(tables);
  if (!fightingRecordTable) return;
  let record = parseRecord(fightingRecordTable);

  //write to a file

  const json = JSON.stringify({
    name: fighterName,
    ...fighterInfo,
    record: record,
  });

  fs.writeFileSync(
    `./boxers/${fighterName.replaceAll(" ", "_")}.json`,
    json.replace(/\\n/g, "")
  );
}

function parseRecord(fightingRecordTable) {
  const [headings, ...rows] = fightingRecordTable.querySelectorAll("tr");

  let record = [];

  for (row of rows) {
    const match = parseMatchRow(row, headings);
  }
  return record;
}

//change the code here
async function scrapeChampions(url) {
  const response = await axios.get(
    "https://en.wikipedia.org/wiki/List_of_world_middleweight_boxing_champions"
  );
  const html = response.data;
  const jsdom = new JSDOM(html);
  const document = jsdom.window.document;
  const tables = document.querySelectorAll("table");
  const championTables = [];

  for (table of tables) {
    if (table.querySelector("th").textContent.includes("Reign Begun")) {
      championTables.push(table);
    }
  }
  const champions = [];
  for (tableToScrape of championTables) {
    const [headings, ...rows] = tableToScrape.querySelectorAll("tr");
    for (row of rows) {
      const cells = row.querySelectorAll("td");
      const nameCell = cells[2];
      const linkCountries = nameCell?.querySelectorAll("a")[0];
      const link = nameCell?.querySelectorAll("a")[1];
      if (link) {
        champions.push(link?.href);
      }
    }
  }
  for (const link of champions) {
    scrapeRecordTable(`https://en.wikipedia.org${link}`);
  }
}

scrapeChampions();
