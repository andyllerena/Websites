const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

function loadLyrics() {
  const lyrics = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(process.cwd(), "lib", "cleaned_drake_lyrics.csv")
    )
      .pipe(csv())
      .on("data", (row) => {
        if (row.Lyrics && row.Lyrics.length > 5) {
          lyrics.push(row.Lyrics);
        }
      })
      .on("end", () => {
        resolve(lyrics);
      })
      .on("error", reject);
  });
}
module.exports = loadLyrics;
