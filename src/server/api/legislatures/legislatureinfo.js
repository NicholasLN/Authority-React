var express = require("express");
const is_number = require("is-number");
const LegislatureVote = require("../../classes/Legislatures/LegislatureVote/LegislatureVote");
var router = express.Router();

const getLegislaturePositions = (country, legislature) => {
  var db = require("../../db");
  return new Promise((resolve, reject) => {
    db.query(`SELECT * FROM legislaturePositions WHERE countryId = ? AND legislatureId = ?`, [country, legislature], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const getLegislatureVotes = (legislature, limit, page) => {
  if (limit == undefined) {
    limit = 15;
  }
  if (page == undefined) {
    page = 0;
  }
  var db = require("../../db");
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM legislatureVotes WHERE legislature = ? ORDER BY id DESC LIMIT ? OFFSET ?", [legislature, limit, page], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

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

router.get("/fetchLegislatures/:country", async function (req, res) {
  var db = require("../../db");
  var countryId = await verifyCountry(req.params.country);
  if (countryId) {
    var fetchLegislatures = new Promise((resolve, reject) => {
      db.query("SELECT * FROM legislatures WHERE countryId = ?", [countryId.id], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
    var legislatures = await fetchLegislatures;
    var newLegislatures = [];
    await Promise.all(
      Object.keys(legislatures).map(async (idx) => {
        var legislature = legislatures[idx];
        legislature.positions = await getLegislaturePositions(countryId.id, legislature.id);
        legislature.rules = JSON.parse(legislature.rules);
        newLegislatures.push(legislature);
      })
    );

    res.send(newLegislatures);
  } else {
    res.status(404).send({ error: "Couldn't find that country." });
  }
});

router.get("/fetchLegislatureVotes/:legislatureId/:limit?/:offset?", async function (req, res) {
  if (is_number(req.params.legislatureId)) {
    var votes = await getLegislatureVotes(req.params.legislatureId, req.params.limit, req.params.offset);
    await Promise.all(
      votes.map(async (vote) => {
        var lv = new LegislatureVote(vote.id);
        await lv.updateVoteInformation();

        vote.author = lv.voteInfo.author;
        vote.actions = lv.voteInfo.actions;
        vote.sumAyes = lv.voteInfo.sumAyes;
        vote.sumNays = lv.voteInfo.sumNays;
        vote.statusString = lv.voteInfo.statusString;
      })
    );
    res.send(votes);
  } else {
    res.status(404).send({ error: "Couldn't find that legislature.'" });
  }
});

module.exports.router = router;
