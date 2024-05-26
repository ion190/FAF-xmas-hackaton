// Import the Google Cloud client library
const vision = require("@google-cloud/vision");
const fs = require("fs");

async function process(credentials, fileName, lang) {
  // Create a client with service account credentials to download from the google cloud console
  const client = new vision.ImageAnnotatorClient({
    keyFilename: credentials,
  });
  const content = fs.readFileSync(fileName);

  const request = {
    image: {
      content,
    },
    imageContext: {
      languageHints: prefferedLanguage(lang),
    },
  };

  // Read the local image as a text document
  const [result] = await client.documentTextDetection(request);
  const output = result.fullTextAnnotation.text;
  const outputFileName = `${fileName.split(".")[0]}.txt`;
  fs.writeFileSync(outputFileName, output, function (err) {
    if (err) {
      return console.log(err);
    } else {
      console.log("Done!");
    }
  });
}

const prefferedLanguage = (lang) => {
  switch (lang) {
    // Handwritten hint
    case "EN-HAND": {
      return ["en-t-i0-handwrit"];
    }
    case "EN": {
      return ["en"];
    }
    // Handwritten hint
    case "RO-HAND": {
      return ["ro-t-i0-handwrit"];
    }
    case "RO": {
      return ["ro"];
    }
    default:
      return ["en", "ro"];
  }
};

module.exports.process = process;
