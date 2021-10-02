var express = require("express");
var router = express.Router();
var isnumber = require("is-number");
var { boolean } = require("boolean");

const Party = require("../../classes/Party/Party");
const User = require("../../classes/User");
const State = require("../../classes/State/State");

const public_information = function (userRow) {
  delete userRow.username;
  delete userRow.password;
  delete userRow.regCookie;
  delete userRow.currentCookie;
  delete userRow.regIP;
  delete userRow.currentIP;
  return userRow;
};

router.get("/getLoggedInUser/:fetchParty?/:fetchState?/:sensitive?", async function (req, res) {
  var fetchParty = req.params.fetchParty === undefined ? true : boolean(req.params.fetchParty);
  var fetchState = req.params.fetchState === undefined ? true : boolean(req.params.fetchState);
  var sensitive = req.params.sensitive === undefined ? false : boolean(req.params.sensitive);

  if (req.session.playerData != null && req.session.playerData.loggedIn) {
    var user = new User(req.session.playerData.loggedInId);
    var userInfo = await user.fetchUserInfo();

    // If requested user exists.
    if (userInfo) {
      if (userInfo.party != 0) {
        var party = new Party(userInfo.party);
        userInfo.partyInfo = await party.fetchPartyInfo();
      }
      if (!sensitive) {
        userInfo = public_information(userInfo);
      }
      // If (in params) they want to add party data.
      if (fetchParty && userInfo.party != 0) {
        const party = new Party(userInfo.party);
        await party.updatePartyInfo(true);
        userInfo.partyInfo = party.partyInfo;
      }
      // If (in params) they want to add state data.
      if (fetchState && (userInfo.state != "" || userInfo.state != undefined)) {
        const state = new State(userInfo.state);
        var stateInfo = await state.fetchStateInfo();
        userInfo.stateInfo = stateInfo;
      }
      res.send(userInfo);
    } else {
      res.send({ error: "User does not exist. Invalidating session data." });
      req.session.playerData.loggedIn = false;
      req.session.playerData.loggedInId = 0;
      req.session.playerData.cookie = 0;
    }
  } else {
    res.sendStatus(404);
  }
});

router.get("/fetchUserById/:userId/:fetchParty?/:fetchState?", async function (req, res) {
  var { userId, fetchParty, fetchState } = req.params;
  fetchParty = fetchParty == null ? true : boolean(fetchParty);
  fetchState = fetchParty == null ? true : boolean(fetchParty);

  var user = new User(userId);
  await user.updateUserInfo();
  if (user.userInfo) {
    var userInfo = public_information(user.userInfo);
    if (!userInfo.hasOwnProperty("error")) {
      if (fetchParty) {
        var party = new Party(userInfo.party);
        await party.updatePartyInfo();
        userInfo.partyInfo = party.partyInfo;
      }
      if (fetchState) {
        var state = new State(userInfo.state);
        await state.updateStateInfo();
        userInfo.stateInfo = state.stateInfo;
      }
      res.send(userInfo);
    } else {
      res.send({ error: "No user with that ID." });
    }
  } else {
    res.send({ error: "User does not exist." });
  }
});

router.get("/getPatrons", async function (req, res) {
  var db = require("../../db");
  db.query("SELECT * FROM patrons", function (err, results) {
    if (err) {
      console.log(err);
    } else {
      res.send(results);
    }
  });
});

module.exports.router = router;
