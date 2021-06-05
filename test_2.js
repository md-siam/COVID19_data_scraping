const request = require("request");
const cheerio = require("cheerio");

async function main() {
  await request(
    "http://103.247.238.92/webportal/pages/covid19.php",
    (error, response, html) => {
      if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);
        const _scrapLabtest = $(
          "html>body>div.wrapper>div>section>div:nth-child(3)>div.col-md-2.col-print-12>div>div.box-body"
        )
          .children("div")
          .text()
          .replace(/\n+/g, "")
          .trim()
          .split(" ");
        const scrapLabtest = parseInt(_scrapLabtest[0], 10);

        const _scrapConfirmed = $(
          "html>body>div.wrapper>div>section>div:nth-child(3)>div.col-md-2.col-print-12>div>div.box-body"
        )
          .children("div")
          .next()
          .text()
          .replace(/\n+/g, "")
          .trim()
          .split(" ");
        const scrapConfirmed = parseInt(_scrapConfirmed[0], 10);

        const _scrapIsolation = $(
          "html>body>div.wrapper> div>section>div:nth-child(3)>div.col-md-2.col-print-12>div>div.box-body"
        )
          .children("div")
          .next()
          .next()
          .text()
          .replace(/\n+/g, "")
          .trim()
          .split(" ");
        const scrapIsolation = parseInt(_scrapIsolation[0], 10);

        const _scrapRecovered = $(
          "html>body>div.wrapper>div>section>div:nth-child(3)>div.col-md-2.col-print-12>div>div.box-body"
        )
          .children("div")
          .next()
          .next()
          .next()
          .text()
          .replace(/\n+/g, "")
          .trim()
          .split(" ");
        const scrapRecovered = parseInt(_scrapRecovered[0], 10);

        const _scrapDeath = $(
          "html>body>div.wrapper>div>section>div:nth-child(3)>div.col-md-2.col-print-12>div>div.box-body"
        )
          .children("div")
          .next()
          .next()
          .next()
          .next()
          .text()
          .replace(/\n+/g, "")
          .trim()
          .split(" ");
        const scrapDeath = parseInt(_scrapDeath[0], 10);

        console.log("Lab Test: " + scrapLabtest);
        console.log("Confirmed: " + scrapConfirmed);
        console.log("Isolation: " + scrapIsolation);
        console.log("Recovered: " + scrapRecovered);
        console.log("Death: " + scrapDeath);
      }
    }
  );
}

main();
