var express = require("express");
const { demoSetPopulation } = require("../../classes/Demographics/Methods");
const { getPositionName, selectColor } = require("../../classes/Misc/Methods");
var router = express.Router();

var fetchDemographics = (sql, prepared) => {
  return new Promise((resolve, reject) => {
    var db = require("../../db");
    db.query(sql, prepared, (err, results) => {
      if (err) {
        reject(err);
        console.log(err);
      } else {
        resolve(results);
      }
    });
  });
};

var makeSql = (country, state, race, gender) => {
  if (country === "undefined" || country === undefined) {
    country = "all";
  }
  if (state === "undefined" || state === undefined) {
    state = "all";
  }
  if (race === "undefined" || race === undefined) {
    race = "all";
  }
  if (gender === "undefined" || gender === undefined) {
    gender = "all";
  }
  var sql = `SELECT * FROM demographics`;
  var prepared = [];
  if (country != "all") {
    sql += " WHERE country = ?";
    prepared.push(country);
  }
  if (state != "all") {
    sql += " AND state = ?";
    prepared.push(state);
  }
  if (race != "all") {
    sql += " AND race = ?";
    prepared.push(race);
  }
  if (gender != "all") {
    sql += " AND gender = ?";
    prepared.push(gender);
  }
  sql += " ORDER BY population DESC";

  return { sql, prepared };
};

router.get("/fetchDemographics/:country?/:state?/:race?/:gender(*)?", async (req, res, next) => {
  var { country, state, race, gender } = req.params;
  var { sql, prepared } = makeSql(country, state, race, gender);

  var results = await fetchDemographics(sql, prepared).catch((err) => {
    res.status(400).send({ error: err });
    next();
  });
  res.status(200).send(results);
});

router.get("/generatePoliticalLeanings/:type/:parseForChart?/:country?/:state?/:race?/:gender(*)?", async (req, res, next) => {
  var { type, parseForChart, country, state, race, gender } = req.params;
  var { sql, prepared } = makeSql(country, state, race, gender);

  var data = await fetchDemographics(sql, prepared);
  var db = require("../../db");
  var politicalLeaningsArray = {
    "-5": 0,
    "-4": 0,
    "-3": 0,
    "-2": 0,
    "-1": 0,
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };
  var sumPopulation = demoSetPopulation(data);
  var demoIdArray = Object.keys(data).map((k) => {
    return data[k].id;
  });

  var positionBreakdownRequest = new Promise((resolve, reject) => {
    db.query("SELECT * FROM demoPositions WHERE demoID IN (?) AND type = ?", [demoIdArray, type], (err, results) => {
      resolve(results);
    });
  });
  var positionBreakdown = await positionBreakdownRequest;
  positionBreakdown.map((position, key) => {
    data.map((demo, k) => {
      if (demo.id == position.demoID) {
        for (let i = -5; i <= 5; i++) {
          politicalLeaningsArray[i] += (demo.population * position[i]) / sumPopulation;
        }
      }
    });
  });
  if (parseForChart) {
    var chartArray = [];
    Object.keys(politicalLeaningsArray).map((position, key) => {
      chartArray.push({
        x: parseInt(position),
        y: Math.round((politicalLeaningsArray[position] / 100) * sumPopulation),
        label: getPositionName(type, position),
        share: politicalLeaningsArray[position].toFixed(2),
        color: selectColor(["blue", "#101010", "red"], position),
      });
    });
    chartArray.sort((a, b) => {
      return a.x - b.x;
    });
    res.send(chartArray);
  } else {
    res.send(politicalLeaningsArray);
  }
});

module.exports.router = router;
