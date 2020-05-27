const fs = require("fs");
const db = require("./db");

/**
 * Description: Read the data stored after api call to the covid-19 page in wikipedia
 * It will pass the data into the next function: parseText
 *
 */
const getData = () => {
  fs.readFile("text.txt", "UTF-8", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      parseText(data);
    }
  });
};

const dateUtils = () => {
  let dateObj = {};
  // Source: https://attacomsian.com/blog/reading-a-file-line-by-line-in-nodejs
  var month = new Array();
  month[0] = "January";
  month[1] = "February";
  month[2] = "March";
  month[3] = "April";
  month[4] = "May";
  month[5] = "June";
  month[6] = "July";
  month[7] = "August";
  month[8] = "September";
  month[9] = "October";
  month[10] = "November";
  month[11] = "December";
  try {
    const date = new Date();
    //We need the date in this format: 27 May
    const today_date = date.getDate() + " " + month[date.getMonth()];
    const yesterday = new Date(date);
    //calculate the day before
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterday_date = yesterday.getDate() + " " + month[date.getMonth()];
    const todayMarker = "On " + today_date;
    const yesterdayMarker = "On " + yesterday_date;

    console.log(todayMarker);
    console.log(yesterdayMarker);
    dateObj["today"] = todayMarker;
    dateObj["yesterday"] = yesterdayMarker;
    return dateObj;
  } catch (err) {
    return err;
  }
};

/**
 * Description: parses a text
 * It will pass the data into the next function: parseText
 *
 */
const parseText = (text) => {
  const marker = dateUtils();
  var subtrIndex = text.indexOf(marker.today);
  if (subtrIndex < 1) {
    subtrIndex = text.indexOf(marker.yesterday);
  }
  console.log(subtrIndex);
  var sentence = text.substring(subtrIndex);
  console.log(sentence);
  newCases(sentence);
  // print all lines
  /*lines.forEach((line) => {
          if (line.indexOf(text) >= 0) {
            console.log(line.indexOf(text));
          }
        });*/
};

const newCases = (str) => {
  //const regex = /[0-9]/g;
  const regex = /([0-9]+ new confirmed cases|[0-9]+ deaths) |([0-9]+ new cases|[0-9]+ deaths)|([0-9]+ new covid cases|[0-9]+ deaths) /g;
  const found = str.match(regex);
  const regex2 = /[0-9]+/g;
  const getNumber = found[0].match(regex2);
  const newDeaths = found[1].match(regex2);

  console.log("type of " + typeof parseInt(getNumber[0]));
  console.log("new deaths " + newDeaths[0]);
  db.get("newcases")
    .push({ value: getNumber[0] }, { deaths: newDeaths[0] })
    .write();
};

module.exports = getData;
