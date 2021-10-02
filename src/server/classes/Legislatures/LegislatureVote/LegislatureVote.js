const { userCosmeticInfo } = require("../../User");

class LegislatureVote {
  constructor(voteId) {
    this.voteId = voteId;
    this.voteInfo = undefined;
  }
  async fetchVoteInformation() {
    var db = require("../../../db");
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM legislatureVotes WHERE id = ?", [this.voteId], (err, results) => {
        if (err) {
          resolve({ error: "Error fetching vote." });
        } else {
          var vote = results[0];
          try {
            vote.actions = JSON.parse(vote.actions);
          } catch (Exception) {
            vote.actions = vote.actions;
          }
          resolve(vote);
        }
      });
    });
  }
  async updateVoteInformation() {
    var voteInformation = await this.fetchVoteInformation();
    if (!voteInformation.hasOwnProperty("error")) {
      this.voteInfo = voteInformation;
      this.voteInfo.author = await userCosmeticInfo(voteInformation.author);
      this.voteInfo.actions = voteInformation.actions;
      this.voteInfo.sumAyes = 0;
      this.voteInfo.sumNays = 0;
      this.voteInfo.statusAsString = await this.statusAsString();
    }
  }
  async statusAsString() {
    var rtn = "IDK.";
    switch (this.voteInfo.passed) {
      case -1:
        rtn = "Ongoing";
        break;
      case 0:
        rtn = "<span class='redFont'>Vote Failed</span>";
        break;
      case 1:
        rtn = "<span class='greenFont'>Vote Passed</span>";
        break;
    }
    return rtn;
  }
}

module.exports = LegislatureVote;
