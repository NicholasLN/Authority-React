var express = require("express");
var router = express.Router();
var State = require("../../classes/State/State");

router.get("/getAllActiveStates", function (req, res) {
  let database = require("../../db");
  let sql = "SELECT name, abbreviation FROM states WHERE active = 1";
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
router.get("/fetchStateInfo/:stateName", async function (req, res, next) {
  var state = new State(req.params.stateName);
  await state.updateStateInfo().catch((err) => {
    res.send({ error: "Something went wrong." });
    next();
  });
  if (state.stateInfo) {
    res.send(state.stateInfo);
  } else {
    res.send({ error: "State not found." });
  }
});

module.exports.router = router;
