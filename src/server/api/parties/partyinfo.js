const { response } = require("express");
var express = require("express");
var router = express.Router();
var isnumber = require("is-number");
const { generateRoleList, getUserRole } = require("../../classes/Party/Methods");
var partyClass = require("../../classes/Party/Party");
var userClass = require("../../classes/User");
var { getLeaderInfo } = require("../../classes/Party/Methods");
const each = require("foreach");
const { forEach } = require("async-foreach");
const Party = require("../../classes/Party/Party");
const { boolean } = require("boolean");
const { userDoesExistId, userCosmeticInfo } = require("../../classes/User");
const { getUserVotes } = require("../../classes/Party/PartyVote/PartyVote");
const User = require("../../classes/User");

router.get("/fetchPartyById/:partyId", async function (req, res) {
  let database = require("../../db");
  let partyId = req.params.partyId;

  if (isnumber(partyId)) {
    const party = new partyClass(partyId);
    await party.updatePartyInfo();
    var partyInfo = party.partyInfo;

    if (partyInfo == undefined) {
      res.send({ error: "Party not found." });
    } else {
      partyInfo.partyRoles = JSON.parse(partyInfo.partyRoles);
      partyInfo.leaderCosmetics = await getPartyLeaderInfo(partyId);
      res.send(partyInfo);
    }
  } else {
    res.send({ error: "Invalid Party ID." });
  }
});

router.get("/partyRoleList/:partyId", async function (req, res) {
  let partyId = req.params.partyId;

  const party = new partyClass(partyId);
  var partyInfo = await party
    .fetchPartyInfo()
    .then((result) => {
      return result[0];
    })
    .catch((error) => {
      console.log(error);
      return undefined;
    });

  var roleList = generateRoleList(partyInfo);
  var newRoleList = [];

  for (var role of roleList) {
    let user = new userClass(role.roleOccupant);
    await user.updateUserInfo();

    var userInfo = user.userInfo;

    if (userInfo) {
      role.occupantName = userInfo.politicianName;
      role.occupantPicture = userInfo.profilePic;
      newRoleList.push(role);
    } else {
      role.occupantName = "Unoccupied";
      role.occupantPicture = `
      https://firebasestorage.googleapis.com/v0/b/authorityimagestorage.appspot.com/o/userPics%2Fdefault.jpg?alt=media&token=554a387f-ee3c-4224-bfd8-47562c223a77`;
      newRoleList.push(role);
    }
  }
  res.send(newRoleList);
});

const getPartyLeaderInfo = async (partyId) => {
  var party = new Party(partyId);
  await party.updatePartyInfo();
  var partyInfo = party.partyInfo;

  var leaderInformation = {
    id: getLeaderInfo(partyInfo, "id"),
    title: getLeaderInfo(partyInfo, "title"),
    picture: null,
    name: null,
  };
  if (leaderInformation.id != "0" && (await userDoesExistId(leaderInformation.id))) {
    const user = new userClass(leaderInformation.id);
    var userInformation = await user.fetchUserInfo();
    leaderInformation.picture = userInformation.profilePic;
    leaderInformation.name = userInformation.politicianName;
  } else {
    leaderInformation.picture = "https://firebasestorage.googleapis.com/v0/b/authorityimagestorage.appspot.com/o/userPics%2Fdefault.jpg?alt=media&token=554a387f-ee3c-4224-bfd8-47562c223a77";
    leaderInformation.name = "Vacant";
  }
  return leaderInformation;
};

router.get("/partyMembers/:partyId/:resultCount?", async function (req, res) {
  let partyId = req.params.partyId;
  let results = req.params.resultCount;

  if (isnumber(partyId)) {
    const party = new partyClass(partyId);
    await party.updatePartyInfo();

    var partyMembers = await party.fetchPartyMembers(parseInt(results));
    for (var member of partyMembers) {
      let userInfo = await userClass.userCosmeticInfo(member.politicianId);
      member.userInfo = userInfo;
      // Voting for
      if (member.votingFor != 0) {
        let votingForUser = await userClass.userCosmeticInfo(member.votingFor);
        member.votingFor = votingForUser;
      }
      member.votes = await partyClass.getUserVotes(member.politicianId);
      // Role
      member.role = getUserRole(party.partyInfo, member.politicianId);
    }
  }
  res.send(partyMembers);
});

router.get("/committeePieChart/:partyId", async function (req, res) {
  if (req.params.partyId != null) {
    var db = require("../../db");
    var query = `SELECT id FROM users WHERE party=? AND lastOnline>? ORDER BY partyInfluence DESC`;
    var dbQuery = new Promise((resolve, reject) => {
      db.query(query, [req.params.partyId, Date.now() - process.env.ACTIVITY_THRESHOLD], (err, rows) => {
        if (err) {
          reject(undefined);
        } else {
          resolve(rows);
        }
      });
    });
    var rows = await dbQuery;
    var party = new Party(req.params.partyId);
    await party.updatePartyInfo();
    if (party.partyInfo) {
      var arr = [];
      var otherData = {
        y: 0,
        label: "Other Politicians",
        share: 0,
      };
      if (rows) {
        // Promise for filling arr with values
        var fetchData = Promise.all(
          rows.map(async (value, idx) => {
            var user = new userClass(value.id);
            await user.updateUserInfo();
            var userVotes = await getUserVotes(value.id, party.partyInfo);
            var share = ((user.userInfo.partyInfluence / party.partyInfo.totalPartyInfluence) * 100).toFixed(2);
            if (share > 10) {
              var data = {
                y: userVotes,
                label: user.userInfo.politicianName,
                share: parseFloat(share),
              };
              arr.push(data);
            } else {
              otherData.y += userVotes;
              otherData.share += parseFloat(share);
            }
          })
        );
        if (parseFloat(otherData.share) >= 0) {
          arr.push(otherData);
        }
        await fetchData;

        // Sort the results based on share.
        arr.sort((a, b) => (a.share < b.share ? 1 : -1));
        res.send(arr);
      }
    } else {
      res.send({ error: "invalid party" });
    }
  } else {
    res.send({ error: "no partyid specified" });
  }
});

router.get("/partyMemberCount/:partyID", async function (req, res) {
  let partyID = req.params.partyID;
  let db = require("../../db");
  let sql = `SELECT id FROM users WHERE party = ?`;

  db.query(sql, [partyID], (err, results) => {
    if (err) {
      res.send({ err: "Party not found." });
    } else {
      res.send({ count: results.length });
    }
  });
});

router.get("/fetchPoliticalParties/:country?/:mode?/:page?/:query?", async function (req, res, next) {
  var { country, mode, page, query } = req.params;
  query == undefined || query == null ? (query = `% %`) : (query = `%${query}%`);
  mode == undefined && (mode = "active");
  page == undefined ? (page = 0) : (page = parseInt(page));

  if (country == undefined) {
    if (req.session.playerData.loggedIn) {
      country = req.session.playerData.loggedInInfo.nation;
    } else {
      res.send({ error: "You are not logged in, and no nation was provided." });
      next();
    }
  }
  var db = require("../../db");

  var sql = "SELECT * FROM parties WHERE nation = ? AND LOWER(name) LIKE ? LIMIT 13 OFFSET ?";
  var partiesResultPromise = new Promise((resolve, reject) => {
    db.query(sql, [country, query, page], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
  var parties = await partiesResultPromise;
  var newParties = [];

  await Promise.all(
    parties.map(async (party) => {
      const activeMembers = new Promise((resolve, reject) => {
        db.query(`SELECT COUNT(*) as active FROM users WHERE party = ? AND lastOnline > ?`, [party.id, Date.now() - process.env.ACTIVITY_THRESHOLD], (err, count) => {
          if (err) return reject(err);
          else {
            return resolve(count[0].active);
          }
        });
      });
      var leaderCosmetics = await getPartyLeaderInfo(party.id);

      party.activeMembers = await activeMembers;
      party.leaderCosmetics = await leaderCosmetics;

      if (mode == "defunct") {
        if (party.activeMembers == 0) {
          newParties.push(party);
        }
      } else {
        if (party.activeMembers >= 1) {
          newParties.push(party);
        }
      }
    })
  );
  newParties.sort((a, b) => {
    return b.activeMembers - a.activeMembers;
  });
  res.send(newParties);
});

router.get("/getFundingRequests/:partyId/:lowerLimit?/:upperLimit?", async (req, res) => {
  var { lowerLimit, upperLimit, partyId } = req.params;
  partyId = parseInt(partyId);
  var lowerLimit = lowerLimit == undefined ? 10 : Math.abs(lowerLimit);
  var upperLimit = upperLimit == undefined ? 0 : Math.abs(upperLimit);

  if (isnumber(upperLimit) && isnumber(lowerLimit)) {
    if (isnumber(partyId)) {
      var db = require("../../db");
      var sql = "SELECT * FROM fundRequests WHERE party = ? AND fulfilled = 0 ORDER BY id DESC LIMIT ? OFFSET ?";
      db.query(sql, [partyId, lowerLimit, upperLimit], async (err, results) => {
        if (err) {
          res.send({ error: err });
        } else {
          var newResults = [];
          var fd = Promise.all(
            results.map(async (result, key) => {
              result.author = await userCosmeticInfo(result.requester);
              newResults.push(result);
            })
          );
          await fd;
          res.send(newResults);
        }
      });
    }
  }
});

router.post("/searchUsersInParty", async function (req, res) {
  var { hasRole, searchQuery, party, active, selectSearch } = req.body;
  hasRole = boolean(hasRole);
  selectSearch = boolean(selectSearch);

  if (party) {
    var returnRes = [];
    var db = require("../../db");
    var like = `%${searchQuery}%`;

    // If you are searching for active party members
    if (active) {
      var sql = "SELECT politicianName, id FROM users WHERE party = ? AND lastOnline > (ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000) - ?) AND politicianName LIKE ? LIMIT 50";
      var prepared = [party, process.env.ACTIVITY_THRESHOLD, like];
    } else {
      var sql = "SELECT politicianName, id FROM users WHERE party = ? AND politicianName LIKE ? LIMIT 50";
      var prepared = [party, like];
    }

    var query = new Promise((resolve, rej) => {
      db.query(sql, prepared, (err, result) => {
        if (err) {
          rej(err);
        }
        resolve(result);
      });
    });
    // If you are searching for members with/without roles
    if (hasRole) {
      returnRes = await query;
      // OR If you are only looking for members without roles
    } else {
      var results = await query;
      var preppedResults = [];

      // -- Fetch party info
      var party = new Party(party);
      await party.updatePartyInfo();
      // --

      each(results, function (result, key) {
        var role = getUserRole(party.partyInfo, result.id, "uniqueID"); // Returns -1 if user does not have a particular role.
        if (role == -1) {
          // If they are a regular user
          preppedResults.push(result);
        }
      });
      returnRes = preppedResults;
    }

    if (selectSearch) {
      var formatted = [];
      each(returnRes, (result, key) => {
        var arr = { value: result.id, label: result.politicianName };
        formatted.push(arr);
      });
      res.send(formatted);
    } else {
      res.send(returnRes);
    }
  } else {
    res.send({ error: "Party not defined." });
  }
});

module.exports.router = router;
