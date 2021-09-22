var express = require("express");
const forEach = require("foreach");
const { userHasPerm } = require("../../../classes/Party/Methods");
const Party = require("../../../classes/Party/Party");
const PartyVote = require("../../../classes/Party/PartyVote/PartyVote");
const { userDoesExistId } = require("../../../classes/User");
const User = require("../../../classes/User");
var router = express.Router();

async function newChairAction(req) {
  var { newChair } = req.body;

  if (await userDoesExistId(newChair)) {
    if (newChair) {
      var action = {
        action: "replaceChair",
        newOccupant: newChair,
      };
      return action;
    }
  }
}
async function renameRoleAction(req) {
  var { roleToRename, renameTo, partyId } = req.body;
  if (roleToRename && renameTo && partyId) {
    var party = new Party(partyId);
    await party.updatePartyInfo(true);
    var role = await party.getRole(roleToRename, "uniqueId", "key");
    var action = {
      action: "renameRole",
      oldName: role,
      renameTo: renameTo,
      uniqueId: roleToRename,
    };
    return action;
  }
}
async function changePermissionsAction(req) {
  var { changePermissionsTarget, perms, partyId } = req.body;
  if (changePermissionsTarget && partyId) {
    var newPerms = {};
    if (perms) {
      forEach(perms, (perm, key) => {
        if (perm == true) {
          var obj = { [key]: +true };
          newPerms = { ...newPerms, ...obj };
        }
      });
    }
    var party = new Party(partyId);
    await party.updatePartyInfo(true);
    var roleName = await party.getRole(changePermissionsTarget, "uniqueId", "key");

    var action = {
      action: "changePermissions",
      uniqueId: changePermissionsTarget,
      roleName: roleName,
      newPerms: newPerms,
    };
    return action;
  }
}
async function deleteRoleAction(req) {
  var { deleteRoleTarget, partyId } = req.body;
  if (deleteRoleTarget && partyId) {
    var party = new Party(partyId);
    await party.updatePartyInfo(true);
    var roleName = await party.getRole(deleteRoleTarget, "uniqueId", "key");
    var action = {
      action: "deleteRole",
      roleName: roleName,
      uniqueId: deleteRoleTarget,
    };
    return action;
  }
}
async function changeOccupantAction(req) {
  var { changeOccupantTarget, changeOccupantId, partyId } = req.body;
  if (changeOccupantTarget && changeOccupantId && partyId) {
    var party = new Party(partyId);
    await party.updatePartyInfo(true);
    var roleName = await party.getRole(changeOccupantTarget, "uniqueId", "key");
    var action = {
      action: "changeOccupant",
      roleName: roleName,
      newOccupant: changeOccupantId,
      uniqueId: changeOccupantTarget,
    };
    return action;
  }
}
async function changeFeesAction(req) {
  var { newFees, partyId } = req.body;
  if (newFees && partyId) {
    var party = new Party(partyId);
    await party.updatePartyInfo();
    if (parseFloat(newFees) > 100) {
      newFees = 100;
    }
    if (parseFloat(newFees) < 0) {
      newFees = 0;
    }
    var action = {
      action: "changeFees",
      newFees: newFees,
      oldFees: party.partyInfo.fees,
    };

    return action;
  }
}
async function renamePartyAction(req) {
  var { renameTo, partyId } = req.body;
  if (renameTo && partyId) {
    var party = new Party(partyId);
    await party.updatePartyInfo();

    var action = {
      action: "renameParty",
      proposedName: renameTo,
      oldName: party.partyInfo.name,
    };
    return action;
  }
}
async function changeVotesAction(req) {
  var { changeVotesTo, partyId } = req.body;
  if (changeVotesTo && partyId) {
    changeVotesTo = Math.abs(changeVotesTo);
    if (changeVotesTo > 1000) {
      changeVotesTo = 1000;
    }
    var party = new Party(partyId);
    await party.updatePartyInfo();

    var action = {
      action: "changeVotes",
      newVotes: changeVotesTo,
      oldVotes: party.partyInfo.votes,
    };
    return action;
  }
}

router.post("/createPartyVote", async (req, res) => {
  var { voteType } = req.body;
  var action = [];
  if (req.session.playerData.loggedIn && req.session.playerData.loggedInInfo.party == req.body.partyId) {
    if (voteType) {
      switch (voteType) {
        case "renameRole":
          action.push(await renameRoleAction(req));
          break;
        case "newChair":
          action.push(await newChairAction(req));
          break;
        case "changePermissions":
          action.push(await changePermissionsAction(req));
          break;
        case "deleteRole":
          action.push(await deleteRoleAction(req));
          break;
        case "changeOccupant":
          action.push(await changeOccupantAction(req));
          break;
        case "changeFees":
          action.push(await changeFeesAction(req));
          break;
        case "renameParty":
          action.push(await renamePartyAction(req));
          break;
        case "changeVotes":
          action.push(await changeVotesAction(req));
          break;
      }
      if (action.length > 0) {
        var sql = `INSERT INTO partyVotes (author, party, name, actions, expiresAt) VALUES (?,?,?,?,?)`;
        var db = require("../../../db");
        var expires = Date.now() + 4 * 24 * 60 * 60 * 1000;
        db.query(sql, [req.session.playerData.loggedInId, req.body.partyId, req.body.voteName, JSON.stringify(action), expires], (err, result) => {
          if (err) {
            res.send({ error: "error" });
          } else {
            res.send({ success: result.insertId });
          }
        });
      } else {
        console.log(action);
        res.send({ error: "Something went wrong with your vote bro." });
      }
    } else {
      res.send({ error: "No vote type provided." });
    }
  } else {
    res.send({ error: "Not logged in." });
  }
});

router.post("/voteAye/", async (req, res) => {
  if (req.session.playerData.loggedIn) {
    if (req.session.playerData.loggedInInfo.party == req.body.partyId) {
      var { voteId, partyId } = req.body;
      if (voteId) {
        var vote = new PartyVote(voteId);
        await vote.updateVoteInformation();
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

          await vote.updatePartyVote("ayes", JSON.stringify(ayes));
          await vote.updatePartyVote("nays", JSON.stringify(nays));

          res.send(vote.voteInfo);
        } else {
          res.send({ error: "No longer accepting votes." });
        }
      }
    } else {
      res.send({ error: "Not in the same party." });
    }
  } else {
    res.send({ error: "Not logged in!" });
  }
});
router.post("/voteNay/", async (req, res) => {
  if (req.session.playerData.loggedIn) {
    if (req.session.playerData.loggedInInfo.party == req.body.partyId) {
      var { voteId } = req.body;
      if (voteId) {
        var vote = new PartyVote(voteId);
        await vote.updateVoteInformation();
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

          await vote.updatePartyVote("ayes", JSON.stringify(ayes));
          await vote.updatePartyVote("nays", JSON.stringify(nays));

          res.send(vote.voteInfo);
        } else {
          res.send({ error: "No longer accepting votes." });
        }
      } else {
        res.send({ error: "Invalid form data." });
      }
    } else {
      res.send({ error: "Not in the same party." });
    }
  } else {
    res.send({ error: "Not logged in!" });
  }
});

router.post("/delayVote", async function (req, res) {
  if (req.session.playerData.loggedInId) {
    var party = new Party(req.session.playerData.loggedInInfo.party);
    await party.updatePartyInfo();
    if (party.partyInfo) {
      if (userHasPerm(req.session.playerData.loggedInId, party.partyInfo, "delayVote")) {
        if (req.body.voteId) {
          var vote = new PartyVote(req.body.voteId);
          await vote.updateVoteInformation();
          if (vote.voteInfo) {
            await vote.updatePartyVote("expiresAt", vote.voteInfo.expiresAt + 24 * 60 * 60 * 1000);
            await vote.updatePartyVote("delay", 1);

            var user = new User(req.session.playerData.loggedInId);
            await user.updateUserInfo();
            await user.updateUser("partyInfluence", user.userInfo.partyInfluence - user.userInfo.partyInfluence * (1 / 6));

            res.send(vote.voteInfo);
          } else {
            res.send({ error: "Can't find vote." });
          }
        } else {
          res.send({ error: "No vote ID provided." });
        }
      } else {
        res.send({ error: "Invalid permissions.." });
      }
    } else {
      res.send({ error: "Can't find party." });
    }
  } else {
    res.send({ error: "Not logged in." });
  }
});

module.exports.router = router;
