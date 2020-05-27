const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("utils/db.json");
const db = low(adapter);
db.defaults({ newcases: [] }).write();
//db.get("posts").push({ id: 1, title: "lowdb is awesome" }).write();

module.exports = db;
