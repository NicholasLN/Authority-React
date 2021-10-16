const { forEach } = require("async-foreach");
const LegislatureVote = require("../../classes/Legislatures/LegislatureVote/LegislatureVote");

async function fetchVotes() {
  var db = require("../../db");
  var date = Date.now();
  var sql = `SELECT * FROM legislatureVotes WHERE passed = -1`;
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
    var lv = new LegislatureVote(voteEntry.id);
    await lv.updateVoteInformation();
    if (Date.now() > lv.voteInfo.expiresAt) {
      console.log("Bill is passed it's expiration date.");
      if (lv.isPassing()) {
        console.log("Bill is passing");
        await lv.handleSuccess();
      } else {
        console.log("Bill is failing");
        await lv.updateLegislatureVoteVariable("status", 0);
        await lv.updateLegislatureVoteVariable("passed", 0);
      }
    }
  });
}
handlePassingVotes();
