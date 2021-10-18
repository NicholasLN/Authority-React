var express = require("express");
const is_number = require("is-number");
const Legislature = require("../../classes/Legislatures/Legislature");
var router = express.Router();
var LegislatureVote = require("../../classes/Legislatures/LegislatureVote/LegislatureVote");
const User = require("../../classes/User");

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

function generateAction(billData) {
  var action = {};
  switch (billData.type) {
    case "optionSelect":
      action = {
        action: "changeLawOption",
        billType: billData.action,
        newOption: billData.option,
      };
      break;
    case "inputBill":
      action = {
        action: "changeLawInput",
        billType: billData.action,
        inputName: billData.inputName,
        newValue: billData.newValue.inputValue,
      };
      break;
    case "appointPosition":
      action = {
        action: "appointPosition",
        billType: billData.action,
        office: billData.office,
        appointee: billData.appointee,
      };
      break;
  }
  return action;
}

router.post("/postVote", async (req, res) => {
  if (req.session.playerData.loggedIn) {
    var author = req.session.playerData.loggedInId;
    var office = req.session.playerData.loggedInInfo.office;
    if (req.body.formData) {
      if (req.body.formData.legislatureId) {
        if (is_number(req.body.formData.legislatureId)) {
          var legislature = new Legislature(req.body.formData.legislatureId);
          await legislature.updateLegislatureInformation();
          if (await legislature.userCanProposeVote(office)) {
            var activeVotes = await User.getActiveLegislatureVotes(author);
            console.log(activeVotes);
            if (activeVotes == 0) {
              if (req.body.formData.billData) {
                var billName = req.body.formData.voteName;
                var billData = req.body.formData.billData;
                var ok = true;
                var status = -1;
                switch (billData.type) {
                  case "optionSelect":
                    if (!billData.hasOwnProperty("option")) {
                      ok = false;
                      res.send({ error: "No bill option provided." });
                    }
                    break;
                  case "inputBill":
                    if (!billData.hasOwnProperty("newValue")) {
                      ok = false;
                      res.send({ error: "No input (try to retype the value...my bad)." });
                    }
                    break;
                  case "appointPosition":
                    status = 3;
                    if (!billData.hasOwnProperty("office") || !billData.hasOwnProperty("appointee")) {
                      ok = false;
                      res.send({ error: "Error." });
                    }
                    break;
                }
                if (ok) {
                  const getRandomPin = (chars, len) => [...Array(len)].map((i) => chars[Math.floor(Math.random() * chars.length)]).join("");
                  var billName = billName != "" ? billName : getRandomPin("123456789", 6);
                  var db = require("../../db");
                  var actions = JSON.stringify(generateAction(billData));
                  var newBillId = await new Promise((resolve, reject) => {
                    db.query(
                      "INSERT INTO legislatureVotes (author, legislature, name, actions, expiresAt, status, constitutional) VALUES (?, ?, ?, ?, ?, ?, ?)",
                      [author, legislature.legislatureId, billName, actions, Date.now() + 24 * 60 * 60 * 1000, status, billData.constitutional],
                      (err, result) => {
                        if (err) {
                          reject(err);
                        } else {
                          resolve(result.insertId);
                        }
                      }
                    );
                  });
                  res.send({ billId: newBillId });
                }
              } else {
                res.send({ error: "No bill data provided." });
              }
            } else {
              res.send({ error: `You already have ${activeVotes} active votes.` });
            }
          } else {
            res.send({ error: "Invalid permissions. Cannot propose vote." });
          }
        } else {
          res.send({ error: "Invalid legislature ID" });
        }
      } else {
        res.send({ error: "No legislature ID provided." });
      }
    } else {
      res.send({ error: "No form data provided." });
    }
  } else {
    res.send({ error: "Not logged in." });
  }
});

module.exports.router = router;
