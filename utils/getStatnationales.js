const wiki = require("wikijs").default;
const db = require("./db");

const wikiCall = () => {
  wiki()
    .page("COVID-19_pandemic_in_Algeria")
    .then((page) => page.fullInfo())
    .then((info) => {
      // Data has changed into: deaths: '592 <small>(as of 23 May)</small>'
      //So we need to split the data and get the first element of the array
      /*(data.confirmed.value = info.general.confirmedCases.split(" ")[0]),
        (data.recovered.value = info.general.recoveryCases.split(" ")[0]),
        (data.deaths.value = info.general.deaths.split(" ")[0]),
        (data.newCases.value = parseData());*/

      db.get("data")
        .push({
          confirmed: info.general.confirmedCases.split(" ")[0],
          recovered: info.general.recoveryCases.split(" ")[0],
          deaths: info.general.deaths.split(" ")[0],
        })
        .write();
    });
};

module.exports = wikiCall;
