const { emailTrigger } = require("./emailtrigger.js");
const Parse = require("parse/node");
const request = require("request");
const cheerio = require("cheerio");

Parse.initialize(process.env.APP_ID, process.env.JS_KEY);
Parse.serverURL = "https://parseapi.back4app.com/";

//?inserting new data into COVID19 class
function insertData(
  scrapeDate,
  scrapeTime,
  scrapLabtest,
  scrapConfirmed,
  scrapIsolation,
  scrapRecovered,
  scrapDeath
) {
  let COVID19 = Parse.Object.extend("COVID19");
  let covid19 = new COVID19();
  console.log("New Data inserted at: " + scrapeTime);
  covid19.set("upDate", scrapeDate);
  covid19.set("upTime", scrapeTime);
  covid19.set("labTest", scrapLabtest);
  covid19.set("confirmed", scrapConfirmed);
  covid19.set("isolation", scrapIsolation);
  covid19.set("recovere", scrapRecovered);
  covid19.set("death", scrapDeath);
  covid19.save().catch(function (error) {
    console.log("Insert error: " + error.message);
    emailTrigger(true);
  });
}

//!updateData function
async function updateData(
  scrapeDate,
  scrapeTime,
  scrapLabtest,
  scrapConfirmed,
  scrapIsolation,
  scrapRecovered,
  scrapDeath
) {
  let COVID19 = Parse.Object.extend("COVID19");
  let covid19Query = new Parse.Query(COVID19);

  covid19Query.equalTo("upDate", scrapeDate);

  let result = await covid19Query.find();
  if (result == false) {
    console.log("New Data inserted");
    insertData(
      scrapeDate,
      scrapeTime,
      scrapLabtest,
      scrapConfirmed,
      scrapIsolation,
      scrapRecovered,
      scrapDeath
    );
  } else {
    let update = await covid19Query.get(result[0].id);
    console.log("Old Data updated at: " + scrapeTime);
    update.set("upTime", scrapeTime);
    update.set("labTest", scrapLabtest);
    update.set("confirmed", scrapConfirmed);
    update.set("isolation", scrapIsolation);
    update.set("recovere", scrapRecovered);
    update.set("death", scrapDeath);
    update.save().catch(function (error) {
      console.log("Update error: " + error.message);
      emailTrigger(true);
    });
  }
}

async function main() {
  await request(
    "http://103.247.238.92/webportal/pages/covid19.php",
    (error, response, html) => {
      if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);
        const siteHeading = $("html>body>div>div>section>div>div>div>span");
        const splitHeading = siteHeading.text().split(" ");
        //console.log(splitHeading);

        const headTitlecheck = splitHeading[0] + " " + splitHeading[1];
        //console.log(headTitlecheck);

        if (headTitlecheck == "Last updated:") {
          //Concatenate date & time
          const scrapeDate =
            splitHeading[2] + " " + splitHeading[3] + " " + splitHeading[4];
          const scrapeTime = splitHeading[5] + " " + splitHeading[6];

          $(
            "html>body>div.wrapper>div>section>div:nth-child(3)>div.col-md-2.col-print-12>div>div.box-body"
          ).each((index, element) => {
            const divs = $(element).find("div");
            const _scrapLabtest = $(divs[0])
              .text()
              .replace(/\n+/g, "")
              .trim()
              .split(" ");
            const _scrapConfirmed = $(divs[2])
              .text()
              .replace(/\n+/g, "")
              .trim()
              .split(" ");
            const _scrapIsolation = $(divs[4])
              .text()
              .replace(/\n+/g, "")
              .trim()
              .split(" ");
            const _scrapRecovered = $(divs[6])
              .text()
              .replace(/\n+/g, "")
              .trim()
              .split(" ");
            const _scrapDeath = $(divs[8])
              .text()
              .replace(/\n+/g, "")
              .trim()
              .split(" ");

            //?converting string to integer
            const scrapLabtest = parseInt(_scrapLabtest[0], 10);
            const scrapConfirmed = parseInt(_scrapConfirmed[0], 10);
            const scrapIsolation = parseInt(_scrapIsolation[0], 10);
            const scrapRecovered = parseInt(_scrapRecovered[0], 10);
            const scrapDeath = parseInt(_scrapDeath[0], 10);

            //*calling function "updateData"
            updateData(
              scrapeDate,
              scrapeTime,
              scrapLabtest,
              scrapConfirmed,
              scrapIsolation,
              scrapRecovered,
              scrapDeath
            );

            // console.log("\nScrape date: " + scrapeDate);
            // console.log("Scrape time: " + scrapeTime);
            // console.log("Lab Test: " + scrapLabtest);
            // console.log("Confirmed: " + scrapConfirmed);
            // console.log("Isolation: " + scrapIsolation);
            // console.log("Recovere: " + scrapRecovered);
            // console.log("Death: " + scrapDeath + "\n");
          });
        } else {
          // console.log(
          //   "There was an error while web scraping COVID19 Data. Please check your JavaScript running @ RPi4"
          // );
          emailTrigger(true);
        }
      } else {
        console.log(error);
      }
    }
  );
}
console.log("COVID19 data scraping has started...");
console.log("Running this task every 1 hour");
main();
