const { boolean } = require("boolean");
var { forEach } = require("async-foreach");
var express = require("express");
const is_number = require("is-number");
const { doesPartyExist } = require("../../../classes/Party/Party");
const Party = require("../../../classes/Party/Party");
const { userCosmeticInfo } = require("../../../classes/User");
const PartyVote = require("../../../classes/Party/PartyVote/PartyVote");
var router = express.Router();

router.get("/fetchVotes/:partyId/:lowerLimit?/:upperLimit?", async (req, res) => {
  var { lowerLimit, upperLimit, partyId, fetchUserInfo } = req.params;
  var lowerLimit = lowerLimit == undefined ? 25 : Math.abs(lowerLimit);
  var upperLimit = upperLimit == undefined ? 25 : Math.abs(upperLimit);
  if (is_number(lowerLimit) && is_number(upperLimit)) {
    if (is_number(partyId)) {
      var partyExists = await doesPartyExist(partyId);
      if (partyExists) {
        var db = require("../../../db");
        var votesPromise = new Promise((resolve, reject) => {
          db.query("SELECT * FROM partyVotes WHERE party=? ORDER BY id DESC LIMIT ? OFFSET ?", [partyId, upperLimit, lowerLimit], (err, results) => {
            if (err) {
              reject(err);
            }
            resolve(results);
          });
        });
        var votes = await votesPromise;
        await Promise.all(
          votes.map(async (vote) => {
            var pv = new PartyVote(vote.id);
            await pv.updateVoteInformation();

            vote.actionString = pv.voteInfo.actionString;
            vote.author = pv.voteInfo.author;
            vote.actions = pv.voteInfo.actions;
            vote.sumAyes = pv.voteInfo.sumAyes;
            vote.sumNays = pv.voteInfo.sumNays;
            vote.statusString = pv.voteInfo.statusString;
          })
        );
        res.send(votes);
      } else {
        res.send({ error: "Has to be a number duh." });
      }
    }
  } else {
    res.send({ error: "Invalid form data." });
  }
});

router.get("/getVote/:voteId", async (req, res) => {
  var { voteId } = req.params;
  if (is_number(voteId)) {
    var db = require("../../../db");
    var sql = `SELECT * FROM partyVotes WHERE id = ?`;

    var getVote = new Promise((resolve, reject) => {
      db.query(sql, voteId, async (err, result) => {
        if (err) {
          resolve();
        } else {
          resolve(result[0]);
        }
      });
    });
    var vote = await getVote;
    if (!vote) {
      res.send({ error: "Vote not found." });
    } else {
      var pv = new PartyVote(vote.id);
      await pv.updateVoteInformation();
      res.send(pv.voteInfo);
    }
  }
});

module.exports.router = router;
