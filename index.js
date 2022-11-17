const axios = require("axios");
const { JSDOM } = require("jsdom");
const fs = require("fs");
const { fips } = require("crypto");

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

scrapeRecordTable("https://en.wikipedia.org/wiki/Marvelous_Marvin_Hagler");
