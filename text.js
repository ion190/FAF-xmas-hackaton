const fs = require("fs");

async function process(fileName, lang) {
  const content = fs.readFileSync(fileName);
  const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
  Donec sit amet posuere dolor. Vestibulum at luctus nunc. Maecenas a nunc 
  id nisi consequat aliquam. Class aptent taciti sociosqu ad litora torquent
  per conubia nostra, per inceptos himenaeos. Curabitur in dapibus quam, 
  sed tempus ligula. Duis sodales posuere mi, a malesuada velit consectetur at.
  Sed at dapibus neque. Mauris et magna ut erat blandit facilisis. 
  Sed sodales venenatis dolor, a venenatis ligula vulputate in.`;
  const output = await Promise.resolve(text);
  const outputFileName = `${fileName.split(".")[0]}.txt`;
  fs.writeFileSync(outputFileName, output, function (err) {
    if (err) {
      return console.log(err);
    } else {
      console.log("The file was saved!");
    }
  });
}

module.exports.process = process;
