const { forEach } = require("async-foreach");
const Party = require("../../classes/Party/Party");
const User = require("../../classes/User");

async function fetchUsers(partyID) {
  var db = require("../../db");
  return new Promise((res, reject) => {
    db.query("SELECT id FROM users WHERE party=?", [partyID], (err, results) => {
      if (err) {
        reject(err);
      } else {
        res(results);
      }
    });
  });
}
async function fetchParties() {
  var db = require("../../db");
  return new Promise((res, reject) => {
    db.query("SELECT * FROM parties", (err, results) => {
      if (err) {
        reject(err);
      } else {
        res(results);
      }
    });
  });
}

async function updateParties() {
  var parties = await fetchParties();
  forEach(parties, async (party, partyKey) => {
    var partyID = party.id;
    var weightedEco = 0;
    var weightedSoc = 0;

    var thisParty = new Party(partyID);
    await thisParty.updatePartyInfo();

    var totalPartyInfluence = thisParty.partyInfo.totalPartyInfluence;

    var partyUsers = await fetchUsers(thisParty.partyID);

    await Promise.all(
      partyUsers.map(async (user, k) => {
        var thisUser = new User(user.id);
        await thisUser.updateUserInfo();
        if (thisUser.active) {
          var userShare = thisUser.userInfo.partyInfluence / totalPartyInfluence / 2;
          weightedEco += thisUser.userInfo.ecoPos * userShare;
          weightedSoc += thisUser.userInfo.socPos * userShare;
        }
      })
    );

    // Intial party positions account for 50% of drift //
    weightedEco += thisParty.partyInfo.initialEcoPos * 0.5;
    weightedSoc += thisParty.partyInfo.initialSocPos * 0.5;

    await thisParty.updateParty("ecoPos", weightedEco.toFixed(2));
    await thisParty.updateParty("socPos", weightedSoc.toFixed(2));
  });
}

updateParties();
