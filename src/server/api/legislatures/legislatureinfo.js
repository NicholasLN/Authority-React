var express = require("express");
const is_number = require("is-number");
const LegislatureVote = require("../../classes/Legislatures/LegislatureVote/LegislatureVote");
var router = express.Router();
var cache = require("../../cache");

const officeHolders = (officeId) => {
  var db = require("../../db");
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM users WHERE office = ?", [officeId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length);
      }
    });
  });
};

const getLegislaturePositions = (country, legislature) => {
  var db = require("../../db");
  return new Promise((resolve, reject) => {
    db.query(`SELECT * FROM legislaturePositions WHERE countryId = ? AND legislatureId = ?`, [country, legislature], async (err, results) => {
      if (err) {
        reject(err);
      } else {
        await Promise.all(
          results.map(async (result) => {
            result.members = await officeHolders(result.id);
          })
        );
        resolve(results);
      }
    });
  });
};
const getLegislatureAppoints = (country, legislature) => {
  var db = require("../../db");
  return new Promise((resolve, reject) => {
    db.query(`SELECT * FROM legislaturePositions WHERE countryId = ? AND isElected = 0 AND appointedBy = ?`, [country, legislature], async (err, results) => {
      if (err) {
        reject(err);
      } else {
        await Promise.all(
          results.map(async (result) => {
            result.members = await officeHolders(result.id);
          })
        );
        resolve(results);
      }
    });
  });
};

const getVoteInfo = async (voteId, vote) => {
  var lv = new LegislatureVote(voteId);
  await lv.updateVoteInformation();

  vote.country = lv.legislatureInfo.countryId;
  vote.author = lv.voteInfo.author;
  vote.actions = lv.voteInfo.actions;
  vote.sumAyes = lv.voteInfo.sumAyes;
  vote.sumNays = lv.voteInfo.sumNays;
  vote.statusString = lv.voteInfo.statusString;
  vote.actionString = lv.voteInfo.actionString;
  vote.ayeVoters = lv.voteInfo.ayeVoters;
  vote.nayVoters = lv.voteInfo.nayVoters;
  vote.passPercentage = parseFloat(lv.voteInfo.passPercentage);
  vote.canVote = lv.voteInfo.canVote;

  return vote;
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

router.get("/fetchLegislatures/:country", cache(10), async function (req, res) {
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
        legislature.appoints = await getLegislatureAppoints(countryId.id, legislature.id);
        newLegislatures.push(legislature);
      })
    );
    newLegislatures.sort((a, b) => {
      return a.id - b.id;
    });
    res.send(newLegislatures);
  } else {
    res.status(404).send({ error: "Couldn't find that country." });
  }
});

router.get("/fetchVote/:voteId", cache(10), async (req, res) => {
  if (is_number(req.params.voteId)) {
    var db = require("../../db");
    var fetchVote = await new Promise((resolve, reject) => {
      db.query("SELECT * FROM legislatureVotes WHERE id = ?", [req.params.voteId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
    if (fetchVote.length > 0) {
      var vote = fetchVote[0];
      res.send(await getVoteInfo(vote.id, vote));
    } else {
      res.send({ error: "Could not find a vote/bill with that ID." });
    }
  } else {
    res.send({ error: "Invalid bill ID." });
  }
});

router.get("/fetchLegislatureVotes/:legislatureId/:limit?/:offset?", cache(10), async function (req, res) {
  if (is_number(req.params.legislatureId)) {
    var votes = await getLegislatureVotes(req.params.legislatureId, req.params.limit, req.params.offset);
    await Promise.all(
      votes.map(async (vote) => {
        var lv = new LegislatureVote(vote.id);
        await lv.updateVoteInformation();
        vote = await getVoteInfo(vote.id, vote);
      })
    );
    res.send(votes);
  } else {
    res.status(404).send({ error: "Couldn't find that legislature.'" });
  }
});

module.exports.router = router;
