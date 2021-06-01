const request = require("request");
const cheerio = require("cheerio");
const cron = require("node-cron");

//? Schedule tasks to be run on the server
// cron.schedule("* * * * *", function () {
//   console.log("running a task every minute");
// });

function main() {
  request(
    "https://www.worldometers.info/coronavirus/",
    (error, response, html) => {
      if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);
        const siteHeading = $("body>div>div>div>div>div");
        const splitHeading = siteHeading.first().next().text().split(" ");
        //console.log(splitHeading);

        const headTitlecheck = splitHeading[0] + " " + splitHeading[1];
        //console.log(headTitlecheck);

        if (headTitlecheck == "Last updated:") {
          //Concatenate date & time
          const scrapeDate =
            splitHeading[2] +
            " " +
            splitHeading[3] +
            " " +
            splitHeading[4].replace(",", "");
          const scrapeTime = splitHeading[5] + " " + splitHeading[6];
          console.log("\nScrape date: " + scrapeDate);
          console.log("Scrape time: " + scrapeTime + "\n");
        } else {
          console.log("There is a change in the 'Last updated:' section\n");
        }
      }
    }
  );
}

main();
