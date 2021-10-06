var express = require("express");
var router = express.Router();
var LegislatureVote = require("../../classes/Legislatures/LegislatureVote/LegislatureVote");

router.post("/voteNay/", async (req, res) => {
  if (req.session.playerData.loggedIn) {
    var { voteId } = req.body;
    if (voteId) {
      var vote = new LegislatureVote(voteId);
      await vote.updateVoteInformation();
      if (vote.voteInfo.canVote.includes(req.session.playerData.loggedInInfo.office)) {
        if (Date.now() < vote.voteInfo.expiresAt) {
          var ayes = eval(vote.voteInfo.ayes);
          var nays = eval(vote.voteInfo.nays);
          nays.map((value, idx) => {
            if (value == req.session.playerData.loggedInId) {
              nays.splice(idx, 1);
            }
          });
          ayes.map((value, idx) => {
            if (value == req.session.playerData.loggedInId) {
              ayes.splice(idx, 1);
            }
          });
          nays.push(req.session.playerData.loggedInId);

          await vote.updateLegislatureVote("ayes", JSON.stringify(ayes));
          await vote.updateLegislatureVote("nays", JSON.stringify(nays));

          res.send(vote.voteInfo);
        } else {
          res.send({ error: "No longer accepting votes." });
        }
      } else {
        res.send({ error: "Insufficient privileges." });
      }
    } else {
      res.send({ error: "Invalid form data." });
    }
  } else {
    res.send({ error: "Not logged in!" });
  }
});
router.post("/voteAye/", async (req, res) => {
  if (req.session.playerData.loggedIn) {
    var { voteId } = req.body;
    if (voteId) {
      var vote = new LegislatureVote(voteId);
      await vote.updateVoteInformation();
      if (vote.voteInfo.canVote.includes(req.session.playerData.loggedInInfo.office)) {
        if (Date.now() < vote.voteInfo.expiresAt) {
          var ayes = eval(vote.voteInfo.ayes);
          var nays = eval(vote.voteInfo.nays);
          nays.map((value, idx) => {
            if (value == req.session.playerData.loggedInId) {
              nays.splice(idx, 1);
            }
          });
          ayes.map((value, idx) => {
            if (value == req.session.playerData.loggedInId) {
              ayes.splice(idx, 1);
            }
          });
          ayes.push(req.session.playerData.loggedInId);

          await vote.updateLegislatureVote("ayes", JSON.stringify(ayes));
          await vote.updateLegislatureVote("nays", JSON.stringify(nays));

          res.send(vote.voteInfo);
        } else {
          res.send({ error: "No longer accepting votes." });
        }
      } else {
        res.send({ error: "Insufficient privileges." });
      }
    } else {
      res.send({ error: "Invalid form data." });
    }
  } else {
    res.send({ error: "Not logged in!" });
  }
});

module.exports.router = router;
