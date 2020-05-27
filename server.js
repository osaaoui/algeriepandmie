const express = require("express");
const wiki = require("wikijs").default;
const bodyParser = require("body-parser");
const path = require("path");
var mcache = require("memory-cache");
//const cronjob = require("./utils/cron");
const parseData = require("./utils/readData");
const db = require("./utils/db");
const fs = require("fs");

const app = express();

//console.log(db);
//parseData();

//serve static files from the react app
//app.use(express.static(path.join(__dirname, "client/build")));
//Put all api endpoints under '/api'
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

wiki()
  .page("COVID-19_pandemic_in_Algeria")
  .then((page) => page.fullInfo())
  .then((info) => {
    // Data has changed into: deaths: '592 <small>(as of 23 May)</small>'
    //So we need to split the data and get the first element of the array
    (data.confirmed.value = info.general.confirmedCases.split(" ")[0]),
      (data.recovered.value = info.general.recoveryCases.split(" ")[0]),
      (data.deaths.value = info.general.deaths.split(" ")[0]),
      console.log("data " + data.recovered.value),
      console.log("data " + data.confirmed.value);
    console.log("data " + data.deaths.value);
  });

const data = {
  confirmed: { value: 0 },
  deaths: { value: 0 },
  recovered: { value: 0 },
};

const wilayas = {
  wilayas: [
    {
      province: "Adrar",
    },
    {
      province: "Chlef",
    },
    {
      province: "Laghouat",
    },
    {
      province: "Oum El Bouaghi",
    },
    {
      province: "Batna",
    },
    {
      province: "Sétif",
    },
    {
      province: "Béjaïa",
    },
    {
      province: "Biskra",
    },
    {
      province: "Béchar",
    },
    {
      province: "Blida",
    },
    {
      province: "Bouira",
    },
    {
      province: "Tamanrasset",
    },
    {
      province: "Tebessa",
    },
    {
      province: "Tlemcen",
    },
    {
      province: "Tiaret",
    },
    {
      province: "Tizi Ouzou",
    },
    {
      province: "Alger",
    },
    {
      province: "Djelfa",
    },
    {
      province: "Jijel",
    },
    {
      province: "Sétif",
    },
    {
      province: "Saïda",
    },
    {
      province: "Skikda",
    },
    {
      province: "Sidi Bel Abbès",
    },
    {
      province: "Annaba",
    },
    {
      province: "Guelma",
    },
    {
      province: "Constantine",
    },
    {
      province: "Médéa",
    },
    {
      province: "Mostaganem",
    },
    {
      province: "M'sila",
    },
    {
      province: "Mascara",
    },
    {
      province: "Ouargla",
    },
    {
      province: "Oran",
    },
    {
      province: "El Bayedh",
    },
    {
      province: "Illizi",
    },
    {
      province: "Bordj Bou Arreridj",
    },
    {
      province: "Boumerdès",
    },
    {
      province: "El Tarf",
    },
    {
      province: "Tindouf",
    },
    {
      province: "Tissemsilt",
    },
    {
      province: "El Oued",
    },
    {
      province: "Khenchela",
    },
    {
      province: "Souk Ahras",
    },
    {
      province: "Tipaza",
    },
    {
      province: "Mila",
    },
    {
      province: "Ain Defla",
    },
    {
      province: "Naâma",
    },
    {
      province: "Aïn Témouchent",
    },
    {
      province: "Ghardaïa",
    },
  ],
};

/*const example = {
  province: "Adrar",
  confirmed: { value: "624" },
  deaths: { value: "115" },
  recovered: { value: "542" },
};*/

const provinces = [];

wiki()
  .page("COVID-19_pandemic_in_Algeria")
  .then((page) => page.tables())
  .then((res) => {
    for (var i = 0; i < 49; i++) {
      var prov = {
        province: res[0][i].province,
        confirmed: { value: res[0][i].confirmedCases },
        recovered: { value: res[0][i].recoveries },
        deaths: { value: res[0][i].deaths },
      };
      provinces.push(prov);
    }
  })
  .catch((error) => {
    console.log(error);
  });

/*setInterval(() => {
  console.log("called from setTimout");
}, 5000);*/

/*const updates = {
  newcases: { value: 15 },
};*/
var updates = 0;

app.get("/api", (req, res) => {
  res.json(data);
});

app.get("/api/wilayas", (req, res) => {
  res.json(wilayas);
});

app.get("/api/newcases", (req, res) => {
  var count, deaths;
  fs.readFile("utils/db.json", "UTF-8", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      count = JSON.parse(data);
      //updates = count.newcases[0];
      updates = {
        newcases: count.newcases[count.newcases.length - 2],
        deaths: count.newcases[count.newcases.length - 1],
      };
      console.log(count.newcases[count.newcases.length - 2]);
      console.log(count.newcases[count.newcases.length - 1]);
      res.json(updates);
    }
  });
});
app.get("/api/wilayas/:wilaya", (req, res) => {
  let { wilaya } = req.query;
  if (wilaya === "Alger") {
    wilaya = "Algiers";
  } else if (wilaya === "Aïn Témouchent") {
    wilaya = "Ain Temouchent";
  } else if (wilaya === "Tébessa") {
    wilaya = "Tebessa";
  } else if (wilaya === "Aïn Defla") {
    wilaya = "Ain Defla";
  }
  let stats = {};
  let result = provinces.filter((prov) => prov.province === wilaya);
  stats.confirmed = result[0].confirmed;
  stats.recovered = result[0].recovered;
  stats.deaths = result[0].deaths;
  stats.newCases = 0;

  console.log(stats);
  res.json(stats);
});

app.get("*", (req, res) => {
  //res.sendFile(path.join(__dirname + "/client/build/index.html"));
  res.sendFile(path.join(__dirname + "/my-app/public/index.html"));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`CoronaApp listening on ${port}`);
