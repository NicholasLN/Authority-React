const { forEach } = require("async-foreach");
const { boolean } = require("boolean");
const logger = require("node-color-log");
const Party = require("../../classes/Party/Party");
const { getUserVotes } = require("../../classes/Party/Party");
const User = require("../../classes/User");

async function fetchUsers() {
  var db = require("../../db");
  return new Promise((res, reject) => {
    db.query("SELECT * FROM users", (err, results) => {
      if (err) {
        reject(err);
      } else {
        res(results);
      }
    });
  });
}
async function partyPower() {
  forEach(await fetchUsers(), async (user, userKey) => {
    var thisUser = new User(user.id);
    await thisUser.updateUserInfo();
    var theirParty = new Party(thisUser.userInfo.party);
    await theirParty.updatePartyInfo();

    if (thisUser.active && thisUser.userInfo.party != 0) {
      try {
        let baseGain = 1;
        let theirVotes = await getUserVotes(thisUser.userID);
        let partyInfluenceGross = theirVotes * 3 + baseGain;
        let socDiff = Math.abs(thisUser.userInfo.socPos - theirParty.partyInfo.socPos);
        let ecoDiff = Math.abs(thisUser.userInfo.ecoPos - theirParty.partyInfo.ecoPos);
        let socPerDebuff = socDiff * 3 + socDiff ** 1.4;
        let ecoPerDebuff = ecoDiff * 3 + ecoDiff ** 1.4;
        let totalDebuff = socPerDebuff + ecoPerDebuff > 90 ? 90 : socPerDebuff + ecoPerDebuff;
        let netGain = partyInfluenceGross - partyInfluenceGross * (totalDebuff / 100);

        thisUser.updateUser("partyInfluence", (thisUser.userInfo.partyInfluence + netGain).toFixed(2));
      } catch (error) {
        logger.color("red").bold().log(`[cron/one_hour_interval/partyPower] Error updating user party power at ID:${thisUser.userID}`);
      }
    }
  });
}
partyPower();
