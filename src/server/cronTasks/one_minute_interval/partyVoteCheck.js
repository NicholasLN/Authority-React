const { forEach } = require("async-foreach");
const PartyVote = require("../../classes/Party/PartyVote/PartyVote");

async function fetchVotes() {
  var db = require("../../db");
  var date = Date.now();
  var sql = `SELECT * FROM partyVotes WHERE passed = -1`;
  return new Promise((res, rej) => {
    db.query(sql, [date], (error, results) => {
      if (error) {
        res([]);
      } else {
        res(results);
      }
    });
  });
}
async function handlePassingVotes() {
  var votes = await fetchVotes();
  forEach(votes, async (voteEntry, idx) => {
    var pv = new PartyVote(voteEntry.id);
    await pv.updateVoteInformation();

    if (Date.now() > pv.voteInfo.expiresAt) {
      var billPassed = pv.voteInfo.regularPassPercentage >= 51;
      if (billPassed) {
        console.log("OK!!!");
        await pv.handleBillSuccess();
      } else {
        await pv.updatePartyVote("passed", 0);
      }
    } else {
      // auto pass
      if (pv.voteInfo.autoPassPercentage >= 60) {
        console.log("Autopass, ", pv.voteInfo.name);
        await pv.handleBillSuccess();
      }
    }
  });
}
handlePassingVotes();
