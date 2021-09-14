var express = require("express");
var router = express.Router();
var { boolean } = require("boolean");

const Party = require("../../classes/Party/Party");
const User = require("../../classes/User");
const State = require("../../classes/State/State");
const is_number = require("is-number");

router.post("/changeUserPositions", async (req, res) => {
  var { newEcoPos, newSocPos } = req.body;
  if (is_number(newEcoPos) && is_number(newSocPos)) {
    if (req.session.playerData.loggedIn) {
      var user = new User(req.session.playerData.loggedInId);
      await user.updateUser("ecoPos", newEcoPos);
      await user.updateUser("socPos", newSocPos);
      res.send(await user.userInfo);
    } else {
      res.send({ error: "Not logged in." });
    }
  } else {
    res.send({ error: "There was an error with the data posted." });
  }
});

module.exports.router = router;
