var express = require("express");
var router = express.Router();

const verifyCountry = (country) => {
  var db = require("../../db");
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM countries WHERE id = ? OR name = ? OR abbreviation = ?", [country, country, country], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result[0]);
      }
    });
  });
};

router.get("/fetchCountryInfo/:countryId", async (req, res) => {
  var countryId = await verifyCountry(req.params.countryId);
  if (countryId) {
    var db = require("../../db");
    db.query("SELECT * FROM countries WHERE id = ?", [countryId.id], (err, result) => {
      if (err) {
        res.status(400).send({ error: "Something went wrong" });
      } else {
        res.status(200).send(result[0]);
      }
    });
  } else {
    res.send({ error: "Country could not be found." });
  }
});

module.exports.router = router;
