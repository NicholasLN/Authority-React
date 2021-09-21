var express = require("express");
var router = express.Router();

router.get("/fetchDemographics/:country?/:state?/:race?/:gender?", async (req, res, next) => {
  var { country, state, race, gender } = req.params;

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

  var db = require("../../db");

  var fetchDemographics = new Promise((resolve, reject) => {
    db.query(sql, prepared, (err, results) => {
      if (err) {
        reject(err);
        console.log(err);
      } else {
        resolve(results);
      }
    });
  });

  var results = await fetchDemographics.catch((err) => {
    res.status(400).send({ error: err });
    next();
  });
  res.status(200).send(results);
});

module.exports.router = router;
