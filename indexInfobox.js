const axios = require("axios");
const { JSDOM } = require("jsdom");
const fs = require("fs");

async function scrapeInfoBox(infoboxTable) {
  if (!infoboxTable) return {};

  const headings = infoboxTable.querySelectorAll("tr");
  const boxerInfoBoxData = {};

  for (heading of headings) {
    heads = heading?.querySelector(".infobox-label")?.textContent;
    data = heading.querySelector(".infobox-data")?.textContent;

    if (heads && data) {
      //console.log(heads, data);
      boxerInfoBoxData[heads] = data;
    }
  }
  //console.log(boxerInfoBoxData);
  return boxerInfoBoxData;
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
  //console.log(scrapeInfoBox(infoboxTable));
}

//scrapeRecordTable("https://en.wikipedia.org/wiki/Marvelous_Marvin_Hagler");
scrapeRecordTable("https://en.wikipedia.org/wiki/John_Mugabi");

module.exports = scrapeInfoBox;
