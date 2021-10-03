const User = require("../../User");
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
      this.voteInfo.ayes = eval(voteInformation.ayes);
      this.voteInfo.nays = eval(voteInformation.nays);
      this.voteInfo.author = await userCosmeticInfo(voteInformation.author);
      this.voteInfo.actions = voteInformation.actions;
      const { sumAyes, sumNays } = await this.getVotes();
      this.voteInfo.sumAyes = sumAyes;
      this.voteInfo.sumNays = sumNays;
      this.voteInfo.statusAsString = await this.statusAsString();
    }
  }
  async getPositionsThatCanVote() {
    var positions = [];

    var db = require("../../../db");
    var getLegislaturePositions = new Promise((resolve, reject) => {
      db.query("SELECT * FROM legislaturePositions WHERE id = ?", [this.voteInfo.legislature], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
    var fetchedPositions = await getLegislaturePositions;
    await Promise.all(
      Object.keys(fetchedPositions).map((result) => {
        var x = fetchedPositions[result];
        positions.push({ id: x.id, votePower: x.votePower });
      })
    );
    return positions;
  }

  async getVotes() {
    var ayes = this.voteInfo.ayes;
    var nays = this.voteInfo.nays;

    var sumAyes = 0;
    var sumNays = 0;

    var positions = await this.getPositionsThatCanVote();
    await Promise.all(
      ayes.map(async (voter, idx) => {
        if (voter) {
          var usr = new User(voter);
          await usr.updateUserInfo();
          if (usr.userInfo) {
            var usrOffice = usr.userInfo.office;
          }
          positions.map((position) => {
            if (usrOffice == position.id) {
              sumAyes += position.votePower;
            }
          });
        }
      })
    );
    await Promise.all(
      nays.map(async (voter, idx) => {
        if (voter) {
          var usr = new User(voter);
          await usr.updateUserInfo();
          if (usr.userInfo) {
            var usrOffice = usr.userInfo.office;
          }
          positions.map((position) => {
            if (usrOffice == position.id) {
              sumNays += position.votePower;
            }
          });
        }
      })
    );
    return { sumAyes, sumNays };
  }

  statusAsString() {
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
