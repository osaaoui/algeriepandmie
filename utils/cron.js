const cron = require("node-cron");
const getNewCases = require("./getData");
const readNewCases = require("./readData");
//const wikiStats = require("./getStatnationales");

//0 */2 * * *   every 2 hours
//http://corntab.com/?c=0_7,10,13,16,19,22_*_*_*
const cronJOb = cron.schedule("0 7,10,13,16,19,22 * * *", function () {
  console.log("Running Cron Job");
  getNewCases();
  readNewCases();
});

module.exports = cronJOb;
