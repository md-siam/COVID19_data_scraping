const request = require("request");
const cheerio = require("cheerio");
const cron = require("node-cron");

//? Schedule tasks to be run on the server
// cron.schedule("* * * * *", function () {
//   console.log("running a task every minute");
// });

async function main() {
  await request(
    "http://103.247.238.92/webportal/pages/covid19.php",
    (error, response, html) => {
      if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);
        const siteHeading = $("body>div>div>section>div>div>div>span");
        const splitHeading = siteHeading.text().split(" ");
        //console.log(splitHeading);

        const headTitlecheck = splitHeading[0] + " " + splitHeading[1];
        //console.log(headTitlecheck);

        if (headTitlecheck == "Last updated:") {
          //Concatenate date & time
          const scrapeDate =
            splitHeading[2] + " " + splitHeading[3] + " " + splitHeading[4];
          const scrapeTime = splitHeading[5] + " " + splitHeading[6];
          console.log("\nScrape date: " + scrapeDate);
          console.log("Scrape time: " + scrapeTime + "\n");
        } else {
          console.log('There is a change in the "Last updated:" section\n');
        }
      }
    }
  );
}

main();
