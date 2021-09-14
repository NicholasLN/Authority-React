var express = require("express");
var router = express.Router();

router.get("/getAllActiveStates", function (req, res) {
  let database = require("../../db");
  let sql = "SELECT name FROM states WHERE active = 1";
  database.query(sql, function (err, results) {
    if (err) throw err;
    res.send(results);
  });
});
router.get("/getStateOwner/:stateName", function (req, res) {
  let database = require("../../db");
  let stateName = req.params.stateName;
  let sql = "SELECT country FROM states WHERE name=?";
  database.query(sql, [stateName], function (err, results) {
    if (err) throw err;
    if (results.length > 0) {
      res.send(results[0].country);
    } else {
      res.send(404);
    }
  });
});

module.exports.router = router;
