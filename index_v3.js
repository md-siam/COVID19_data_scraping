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

            //!converting string to integer
            const scrapLabtest = parseInt(_scrapLabtest[0], 10);
            const scrapConfirmed = parseInt(_scrapConfirmed[0], 10);
            const scrapIsolation = parseInt(_scrapIsolation[0], 10);
            const scrapRecovered = parseInt(_scrapRecovered[0], 10);
            const scrapDeath = parseInt(_scrapDeath[0], 10);

            console.log("\nScrape date: " + scrapeDate);
            console.log("Scrape time: " + scrapeTime + "\n");
            console.log("Lab Test: " + scrapLabtest);
            console.log("Confirmed: " + scrapConfirmed);
            console.log("Isolation: " + scrapIsolation);
            console.log("Recovere: " + scrapRecovered);
            console.log("Death: " + scrapDeath + "\n");
          });
        } else
          console.log(
            "There was an error while web scraping COVID19 Data. Please check your JavaScript running @ RPi4\n"
          );
      }
    }
  );
}

main();
