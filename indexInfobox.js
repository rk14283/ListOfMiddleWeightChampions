const axios = require("axios");
const { JSDOM } = require("jsdom");
const fs = require("fs");

async function scrapeInfoBox(infoboxTable) {
  if (!infoboxTable) return {};

  const infoBoxTableBody = infoboxTable.querySelector("tbody");
  const tableTitle = infoboxTable.querySelector(".infobox-label");
  const tableData = infoboxTable.querySelector(".infobox-data");
  //console.log(infoBoxTableBody);

  console.log(tableTitle.textContent);
  console.log(tableData.textContent);

  const headings = infoboxTable.querySelectorAll("tr");
  const rows = infoboxTable.querySelectorAll("tr");

  for (heading of headings) {
    heads = heading.querySelector(".infobox-label")?.textContent;
    console.log(heads);
  }

  for (heading of headings) {
    data = heading.querySelector(".infobox-data")?.textContent;
    console.log(data);
  }

  //return { tableHead: tableHead };

  //try to get just one piece of data first
}
async function scrapeRecordTable(url) {
  //console.log("URL", url);
  const response = await axios.get(url);
  const html = response.data;
  const jsdom = new JSDOM(html);
  const document = jsdom.window.document;
  const fighterName = document
    .querySelector("h1")
    .textContent.replace(" (boxer)", "");

  const infoboxTable = document.querySelector(".infobox");
  const fighterInfo = scrapeInfoBox(infoboxTable);
  //console.log(fighterInfo);
  //console.log(infoboxTable);
}

scrapeRecordTable("https://en.wikipedia.org/wiki/Marvelous_Marvin_Hagler");

//   //console.log(infoBoxTable);
//   //console.log(table);

//   const [headings, ...rows] = infoBoxTable.querySelectorAll("tr");

//   for (row in rows) {
//     head = row.querySelectorAll(".infobox-label");
//   }
//   //   // const heads = infoboxTable.querySelector(".infobox-label");

//   //   for (row of rows) {
//   //     const heads = row.querySelector("th");
//   //     const cell = heads?.querySelector("td");
//   //     //console.log(cell);
//   //     if (cell) {
//   //       newCell = cell.querySelector("span");
//   //       console.log(newCell);
//   //     }
//   //   }

//   //   //const [headings, ...rows] = tableToScrape.querySelectorAll("tr");
//   //   //   for (rows in infoBoxTable) {
//   //   //     //console.log(rows);
//   //   //     for (row in rows) {
//   //   //       console.log(row);
//   //   //     }

//   //   //     //headings tr>th
//   //   //     //data>td
//   //   //   }
