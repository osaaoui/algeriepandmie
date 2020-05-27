const fs = require("fs");
const wiki = require("wikijs").default;

const fetchCurrentData = () => {
  return wiki()
    .page("COVID-19_pandemic_in_Algeria")
    .then((page) => page.content())
    .then((info) => info[1].items[3].content)
    .then((info) => writeToFile(info));
};

function writeToFile(info) {
  var data = info;
  fs.writeFile("utils/text.txt", data, function (err) {
    if (err) {
      console.log(err);
    }
  });
}

module.exports = fetchCurrentData;
