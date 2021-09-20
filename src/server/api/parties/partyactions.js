var express = require("express");
var router = express.Router();
var User = require("../../classes/User");
var Party = require("../../classes/Party/Party");
var each = require("foreach");
const { getLeaderInfo, getUserRole, userHasPerm } = require("../../classes/Party/Methods");
const { randomString } = require("../../classes/Misc/setSessionDefaults");
const is_number = require("is-number");
const PartyVote = require("../../classes/Party/PartyVote/PartyVote");

/**
 * This just extracts the information for the client such as updated party/user info (for a SEAMLESS experience :P)
 * @param {*} userId
 * @param {*} partyId
 * @returns userinfo, partyinfo
 */
async function getClientInformation(userId, partyId) {
  var user = new User(userId);
  await user.updateUserInfo();

  var party = new Party(partyId);
  await party.updatePartyInfo();

  console.log(party.partyInfo);

  var sendData = { partyInfo: party.partyInfo, userInfo: user.userInfo };
  return sendData;
}

router.get("/changePartyVote/:voteFor", async function (req, res) {
  if (req.session.playerData.loggedIn) {
    const voteFor = req.params.voteFor;

    const loggedInUserClass = new User(req.session.playerData.loggedInId);
    await loggedInUserClass.updateUserInfo();
    const loggedInUserInformation = loggedInUserClass.userInfo;

    const votingForUserClass = new User(voteFor);
    await votingForUserClass.updateUserInfo();
    const votingForUserInformation = votingForUserClass.userInfo;

    if (votingForUserInformation) {
      if (loggedInUserInformation.partyVotingFor != votingForUserInformation.id) {
        if (loggedInUserInformation.party == votingForUserInformation.party) {
          var db = require("../../db");
          const sql = `UPDATE users SET partyVotingFor = ? WHERE id= ?`;
          db.query(sql, [voteFor, req.session.playerData.loggedInId], function (err, results) {
            if (err) {
              throw err;
            } else {
              res.sendStatus(200);
            }
          });
        } else {
          res.send({ error: "Not in the same party." });
        }
      } else {
        res.send({ error: "You are already voting for this user." });
      }
    } else {
      res.send({ error: "Person does not exist." });
    }
  } else {
    res.send({ error: "Not logged in." });
  }
});

/**
 * Route that handles leaving a party.
 */
router.get("/leaveParty", async function (req, res) {
  if (req.session.playerData.loggedIn) {
    let userData = req.session.playerData.loggedInInfo;
    if (req.session.playerData.loggedInInfo.party != 0) {
      var userParty = new Party(userData.party);
      await userParty.updatePartyInfo();
      var leaveStatus = await userParty.memberLeave(userData.id);
      if (leaveStatus == 200) {
        res.send(await getClientInformation(userData.id, userData.party));
      }
    }
  }
});

/**
 * Route that handles joining a party
 * @name /joinParty/partyID
 * @param {number} partyID
 */
router.get("/joinParty/:partyId", async function (req, res) {
  let partyToJoin = req.params.partyId;
  if (req.session.playerData.loggedIn) {
    let userData = req.session.playerData.loggedInInfo;
    if (userData.party != 0) {
      var currentUserParty = new Party(userData.party);
      await currentUserParty.updatePartyInfo();
      await currentUserParty.memberLeave(userData.id);
    }
    var party = new Party(partyToJoin);

    var joinStatus = await party.memberJoin(userData.id);
    if (joinStatus == 200) {
      res.send(await getClientInformation(userData.id, partyToJoin));
    } else {
      res.send({ error: "Error joining party." });
    }
  } else {
    res.send({ error: "Not logged in." });
  }
});

/**
 * Route that handles claiming leadership within party
 */
router.get("/claimPartyLeadership", async function (req, res) {
  if (req.session.playerData.loggedIn) {
    var userData = req.session.playerData.loggedInInfo;
    if (userData) {
      var party = new Party(userData.party);
      await party.updatePartyInfo();
      if (getLeaderInfo(party.partyInfo, "id") == 0) {
        var leaderUniqueID = getLeaderInfo(party.partyInfo, "uniqueID");
        var userUniqueID = getUserRole(party.partyInfo, userData.id, "uniqueID");
        var resp = await party.changeOccupant(leaderUniqueID, userData.id);
        if (resp == 200) {
          if (userUniqueID != -1) {
            await party.changeOccupant(userUniqueID, 0);
          }
          res.send(await getClientInformation(userData.id, userData.party));
        }
      } else {
        res.send({ error: "There is already a leader." });
      }
    }
  }
});

/**
 * Route that handles resigning from a role.
 */
router.get("/resignFromRole", async function (req, res) {
  if (req.session.playerData.loggedIn) {
    var userData = req.session.playerData.loggedInInfo;
    if (userData) {
      var party = new Party(userData.party);
      await party.updatePartyInfo();
      var roleUniqueID = getUserRole(party.partyInfo, userData.id, "uniqueID");
      // If they have a role.
      if (roleUniqueID != -1) {
        var resp = await party.changeOccupant(roleUniqueID, 0);
        if (resp == 200) {
          res.send(await getClientInformation(userData.id, userData.party));
        }
      } else {
        res.send({ error: "User is an ordinary member." });
      }
    }
  }
});

router.post("/createParty", async function (req, res) {
  if (req.session.playerData.loggedIn) {
    var playerData = req.session.playerData.loggedInInfo;
    if (playerData.authority >= 50) {
      if ((await Party.doesPartyExist(partyName)) == 0) {
        var { partyName, partyEcoPosition, partySocPosition, chairTitle, votes } = req.body;
        if (is_number(votes) && votes >= 250 && votes <= 1000) {
          if (!chairTitle) {
            chairTitle = "Chairman";
          }
          var partyRoles = {};
          partyRoles[chairTitle] = {
            perms: {
              leader: 1,
            },
            occupant: playerData.id,
            uniqueID: randomString(10),
          };
          var sql = `INSERT INTO parties (nation, name, initialEcoPos, initialSocPos, ecoPos, socPos, partyRoles, votes)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
          let db = require("../../db");
          db.query(sql, [playerData.nation, partyName, partyEcoPosition, partySocPosition, partySocPosition, partySocPosition, JSON.stringify(partyRoles), votes], async (err, result) => {
            if (err) {
              res.send({ error: err });
            } else {
              if (playerData.party != 0) {
                var oldParty = new Party(playerData.party);
                await oldParty.updatePartyInfo();
                await oldParty.memberLeave(playerData.id);
              }
              var user = new User(playerData.id);
              var party = new Party(result.insertId);
              await party.updatePartyInfo();
              await user.updateUser("party", result.insertId);
              var userInfo = await user.updateUser("authority", playerData.authority - 50);
              var partyInfo = party.partyInfo;
              res.send({ newUserInfo: userInfo, newPartyInfo: partyInfo });
            }
          });
        } else {
          res.send({ error: "Check your votes." });
        }
      } else {
        res.send({ error: "Party already exists (with that name)" });
      }
    } else {
      res.send({ error: "Not enough AUTHORITY. Get some, pleb." });
    }
  }
});

// TODO: OH MY FUCKING GOD OPTIMIZE THIS
router.post("/createPartyRole", async function (req, res) {
  if (req.session.playerData.loggedIn) {
    const { partyId, roleOccupant, createRoleName, perms } = req.body;
    if (partyId) {
      if (createRoleName) {
        if (roleOccupant) {
          var user = new User(roleOccupant);
          await user.updateUserInfo();
          if (user.userInfo.party == partyId) {
            if (perms) {
              each(perms, (permValue, permKey) => {
                if (!permValue) {
                  delete perms[permKey];
                }
              });
              var party = new Party(partyId);
              await party.updatePartyInfo(true);
              // 4 because Chair is counted.
              var numRoles = Object.keys(party.partyInfo.partyRoles).length;
              if (numRoles <= 3) {
                if (userHasPerm(req.session.playerData.loggedInId, party.partyInfo, "leader")) {
                  let numPerms = Object.keys(perms).length;
                  if (numPerms <= 3) {
                    if (createRoleName.length <= 25) {
                      if (getUserRole(party.partyInfo, roleOccupant, "uniqueID") == -1) {
                        var newRole = {};
                        newRole[createRoleName] = {
                          perms: {},
                          occupant: roleOccupant,
                          uniqueID: randomString(10),
                        };
                        each(perms, (perm, permIndex) => {
                          if (perm) {
                            newRole[createRoleName].perms[permIndex] = 1;
                          }
                        });
                        var newPartyRoles = JSON.stringify({ ...party.partyInfo.partyRoles, ...newRole });
                        var newPartyInfo = await party.updateParty("partyRoles", newPartyRoles);
                        res.send(newPartyInfo);
                      } else {
                        res.send({ error: "User already has a role." });
                      }
                    } else {
                      res.send({ error: "Role name is too long (max 25 chars)" });
                    }
                  } else {
                    res.send({ error: "Too many permissions. Max # is 3." });
                  }
                } else {
                  res.send({ error: "You do not have permission to modify this party. Shithead." });
                }
              } else {
                res.send({ error: "Too many party roles." });
              }
            }
          } else {
            res.send({ error: "user is not in party" });
          }
        }
      }
    }
  }
});

router.post("/updatePartyBio", async function (req, res) {
  if (req.session.playerData.loggedIn) {
    var { partyId, newBio } = req.body;
    if (partyId) {
      if (req.session.playerData.loggedInInfo.party == partyId) {
        var party = new Party(partyId);
        await party.updatePartyInfo();

        if (userHasPerm(req.session.playerData.loggedInId, party.partyInfo, "leader")) {
          var partyInfo = await party.updateParty("partyBio", newBio);
          res.send(partyInfo);
        } else {
          res.send({ error: "Invalid permissions" });
        }
      }
    } else {
      res.send({ error: "No party ID provided." });
    }
  }
});

router.post("/createFundRequest", async function (req, res) {
  var { requestAmount, requestReason } = req.body;
  if (req.session.playerData.loggedIn) {
    if (requestAmount && requestAmount > 0) {
      if (requestReason) {
        var db = require("../../db");
        var createRequestPromise = new Promise(function (resolve, reject) {
          db.query(
            "INSERT INTO fundRequests (party, requester, requesting, reason) VALUES (?, ?, ?, ?)",
            [req.session.playerData.loggedInInfo.party, req.session.playerData.loggedInId, requestAmount, requestReason],
            (err, results) => {
              if (err) {
                reject(err);
              }
              if (results) {
                resolve(results);
              }
            }
          );
        });
        await createRequestPromise.then((results) => res.sendStatus(200)).catch((err) => res.status(400).send({ err }));
      } else {
        res.send({ error: "No reason provided" });
      }
    }
  }
});

router.post("/approveFundingReq", async function (req, res) {
  var { requestId, partyId } = req.body;
  if (req.session.playerData.loggedIn) {
    var party = new Party(partyId);
    await party.updatePartyInfo();
    if (party) {
      if (
        userHasPerm(req.session.playerData.loggedInId, party.partyInfo, "sendFunds") ||
        userHasPerm(req.session.playerData.loggedInId, party.partyInfo, "leader") ||
        userHasPerm(req.session.playerData.loggedInId, party.partyInfo, "approveFundingReq")
      ) {
        var db = require("../../db");
        var voteInfo = new Promise((resolve, reject) => {
          db.query("SELECT * FROM fundRequests WHERE id = ?", [requestId], (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result[0]);
            }
          });
        });
        voteInfo
          .then(async (result) => {
            if (party.partyInfo.partyTreasury >= result.requesting) {
              await party.updateParty("partyTreasury", party.partyInfo.partyTreasury - result.requesting);
              var user = new User(result.requester);
              await user.updateUserInfo();
              await user.updateUser("campaignFinance", user.userInfo.campaignFinance + result.requesting);
              res.sendStatus(200);

              await db.query("UPDATE fundRequests SET fulfilled = 1 WHERE id = ?", [requestId]);
            } else {
              res.send({ error: "Not enough money in the party treasury." });
            }
          })
          .catch((err) => {
            res.send({ error: "Funding request could not be found." });
          });
      } else {
        res.send({ error: "Invalid permissions." });
      }
    } else {
      res.send({ error: "Party does not exist" });
    }
  }
});

router.post("/denyFundingReq", async (req, res) => {
  var { requestId, partyId } = req.body;
  if (req.session.playerData.loggedIn) {
    var party = new Party(partyId);
    await party.updatePartyInfo();
    if (party) {
      if (
        userHasPerm(req.session.playerData.loggedInId, party.partyInfo, "sendFunds") ||
        userHasPerm(req.session.playerData.loggedInId, party.partyInfo, "leader") ||
        userHasPerm(req.session.playerData.loggedInId, party.partyInfo, "approveFundingReq")
      ) {
        var db = require("../../db");
        var resp = new Promise((resolve, reject) => {
          db.query("UPDATE fundRequests SET fulfilled = 1 WHERE id = ?", [requestId], (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result[0]);
            }
          });
        });
        await resp
          .then((result) => {
            res.sendStatus(200);
          })
          .catch((err) => res.send({ error: "Error denying request" }));
      }
    } else {
      res.send({ error: "Party not found." });
    }
  } else {
    res.send({ error: "No user logged in." });
  }
});

router.post("/sendMoney", async function (req, res) {
  var { sendTo, sendAmount } = req.body;
  if (sendTo != undefined && sendAmount != undefined) {
    if (req.session.playerData.loggedIn) {
      if (req.session.playerData.loggedInInfo.party != 0) {
        var userParty = new Party(req.session.playerData.loggedInInfo.party);
        await userParty.updatePartyInfo();

        var sendTo = new User(sendTo);
        await sendTo.updateUserInfo();

        if (sendTo.userInfo.party == req.session.playerData.loggedInInfo.party) {
          if (userParty.partyInfo.partyTreasury >= sendAmount) {
            await userParty.updateParty("partyTreasury", parseFloat(userParty.partyInfo.partyTreasury) - parseFloat(sendAmount));
            await sendTo.updateUser("campaignFinance", parseFloat(sendTo.userInfo.campaignFinance) + parseFloat(sendAmount));
            res.sendStatus(200);
          } else {
            res.send({ error: "Not enough money within the party treasury." });
          }
        } else {
          res.send({ error: "Not in the same party." });
        }
      } else {
        res.send({ error: "Not in any party." });
      }
    } else {
      res.send({ error: "Not logged in." });
    }
  } else {
    res.send({ error: "Yo, bro, something went wrong." });
  }
});

router.post("/donateMoney", async function (req, res) {
  var { moneyAmount, partyId } = req.body;
  if (req.session.playerData.loggedIn) {
    if (is_number(moneyAmount)) {
      if (req.session.playerData.loggedInInfo.party != 0) {
        var party = new Party(req.session.playerData.loggedInInfo.party);
        var user = new User(req.session.playerData.loggedInId);
        await party.updatePartyInfo();
        await user.updateUserInfo();

        if (user.userInfo.campaignFinance >= moneyAmount) {
          await party.updateParty("partyTreasury", parseFloat(party.partyInfo.partyTreasury) + parseFloat(moneyAmount));
          await user.updateUser("campaignFinance", parseFloat(user.userInfo.campaignFinance) - parseFloat(moneyAmount));
          res.status(200).send("Successfully donated funds.");
        } else {
          res.send({ error: "Not enough money." });
        }
      } else {
        res.send({ error: "Not in a party." });
      }
    }
  } else {
    res.send({ error: "Not logged in." });
  }
});

module.exports.router = router;
