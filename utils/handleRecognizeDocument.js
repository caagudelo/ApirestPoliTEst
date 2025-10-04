const Tesseract = require("tesseract.js");
const fs = require("fs");
const path = require("path");

async function handleRecognizeDocument(imagePath) {
  const imageBuffer = fs.readFileSync(imagePath);
  const result = await Tesseract.recognize(imageBuffer, "spa", {
    logger: info => console.log(info.progress),
  });

  return result.data.text;
}

module.exports = handleRecognizeDocument;