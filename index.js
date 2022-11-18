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

async function scrapeRecordTable(url) {
  const response = await axios.get(url);
  const html = response.data;
  const jsdom = new JSDOM(html);
  const document = jsdom.window.document;
  const tables = document.querySelectorAll("table");
  //console.log(tables.length);
  let tableToScrape = findRecordTable(tables);
  if (!tableToScrape) return;

  //console.log(tableToScrape);
  const [headings, ...rows] = tableToScrape.querySelectorAll("tr");

  let record = [];
  let heads = [];

  if (headings.textContent[57] == "A") {
    for (row of rows) {
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

      const opponentName = Opponent?.textContent;
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
      //console.log(opponentName,serialNumber,fightResult,tally,foughtAgainst,winType,endRound,fightDate,fighterAge,fightLocation,remarks);

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
      //console.log(boxerRecord);
      record.push(boxerRecord);
    }
    //console.log(record);
    const json = JSON.stringify(record);
    const recordBoxer = url.split("https://en.wikipedia.org/wiki/");
    fs.writeFileSync(`${recordBoxer}.json`, json.replace(/\\n/g, ""));
  } else {
    for (row of rows) {
      const [
        Number,
        Result,
        Record,
        Opponent,
        Type,
        RoundTime,
        Date,
        //Age,
        Location,
        Notes,
      ] = row.querySelectorAll("td");

      const opponentName = Opponent?.textContent;
      const serialNumber = Number?.textContent;
      const fightResult = Result?.textContent;
      const tally = Record?.textContent;
      const foughtAgainst = Opponent?.textContent;
      const winType = Type?.textContent;
      const endRound = RoundTime?.textContent;
      const fightDate = Date?.textContent;
      // const fighterAge = Age?.textContent;
      const fightLocation = Location?.textContent;
      const remarks = Notes?.textContent;
      //console.log(opponentName,serialNumber,fightResult,tally,foughtAgainst,winType,endRound,fightDate,fighterAge,fightLocation,remarks);

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
      //console.log(boxerRecord);
      record.push(boxerRecord);
    }
    //console.log(record);
  }
  const json = JSON.stringify(record);
  const recordBoxer = url.split("https://en.wikipedia.org/wiki/");
  fs.writeFileSync(`${recordBoxer}.json`, json.replace(/\\n/g, ""));
  //console.log(json.replace(/\\n/g, ""));
}

//scrapeRecordTable();

async function scrapeChampions() {
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
  //console.log(championTables.length);

  const champions = [];
  for (tableToScrape of championTables) {
    const [headings, ...rows] = tableToScrape.querySelectorAll("tr");
    for (row of rows) {
      const cells = row.querySelectorAll("td");
      //console.log("cells", cells[2]?.textContent);
      //console.log("titleRow", cells[3]?.textContent);
      const nameCell = cells[2];
      const linkCountries = nameCell?.querySelectorAll("a")[0];
      const link = nameCell?.querySelectorAll("a")[1];
      //console.log("linkCOuntries", linkCountries?.href);
      //console.log("link", link?.href);
      if (link) {
        champions.push(link?.href);
      }
    }
  }
  //console.log(champions);
  for (const link of champions) {
    scrapeRecordTable(`https://en.wikipedia.org${link}`);
  }
}

scrapeChampions();
