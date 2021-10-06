const User = require("../../User");
const { userCosmeticInfo, getUserLegislativePosition } = require("../../User");
const Legislature = require("../Legislature");

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
          resolve(vote);
        }
      });
    });
  }
  async updateVoteInformation() {
    var voteInformation = await this.fetchVoteInformation();
    if (!voteInformation.hasOwnProperty("error")) {
      this.voteInfo = voteInformation;

      var legislature = new Legislature(this.voteInfo.legislature);
      await legislature.updateLegislatureInformation();

      this.legislatureInfo = legislature.legislatureInfo;
      this.voteInfo.ayes = eval(voteInformation.ayes);
      this.voteInfo.nays = eval(voteInformation.nays);
      this.voteInfo.author = await userCosmeticInfo(voteInformation.author);
      this.voteInfo.positions = await this.getPositionsThatCanVote();
      try {
        this.voteInfo.actions = JSON.parse(voteInformation.actions);
      } catch (Exception) {
        this.voteInfo.actions = voteInformation.actions;
      }
      const { sumAyes, sumNays } = await this.getVotes();
      this.voteInfo.sumAyes = sumAyes;
      this.voteInfo.sumNays = sumNays;
      this.voteInfo.statusString = await this.statusAsString();
      this.voteInfo.actionString = await this.getVoteAction();
      this.voteInfo.ayeVoters = await this.getVoters(this.voteInfo.ayes);
      this.voteInfo.nayVoters = await this.getVoters(this.voteInfo.nays);
      this.voteInfo.passPercentage = await this.passPercentage();
    }
  }
  async passPercentage() {
    if (this.voteInfo.constitutional == 1) {
      return ((this.voteInfo.sumAyes / (await this.getTotalPossibleVotes())) * 100).toFixed(2);
    } else {
      return ((this.voteInfo.sumAyes / (this.voteInfo.sumAyes + this.voteInfo.sumNays)) * 100).toFixed(2);
    }
  }

  async getTotalPossibleVotes() {
    var sum = 0;
    var db = require("../../../db");
    await Promise.all(
      this.voteInfo.positions.map(async (position) => {
        if (position.type == "singleSeat") {
          var occupants = await new Promise((resolve, reject) => {
            db.query("SELECT * FROM users WHERE office = ?", [position.id], (err, results) => {
              if (err) {
                reject(err);
              } else {
                resolve(results.length);
              }
            });
          });
          sum += occupants * position.votePower;
        }
        if (position.type == "multipleSeats") {
          var seats = await new Promise((resolve, reject) => {
            db.query("SELECT SUM(officeSeats) as total FROM users WHERE office = ?", [position.id], (err, results) => {
              if (err) {
                reject(err);
              } else {
                resolve(results[0]);
              }
            });
          });
          sum += seats.total * position.votePower;
        }
      })
    );
    return sum;
  }

  /**
   * Method for fetching the legislative positions that can vote on the specified bill.
   * @returns
   */
  async getPositionsThatCanVote() {
    var positions = [];

    var db = require("../../../db");
    var getLegislaturePositions = new Promise((resolve, reject) => {
      db.query("SELECT * FROM legislaturePositions WHERE legislatureId = ?", [this.voteInfo.legislature], (err, results) => {
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
        positions.push(x);
      })
    );
    return positions;
  }
  /**
   * Get the sum of ayes and nays for the specified bill.
   * @returns object with ayes and nays.
   */
  async getVotes() {
    var ayes = this.voteInfo.ayes;
    var nays = this.voteInfo.nays;

    var sumAyes = 0;
    var sumNays = 0;

    await Promise.all(
      ayes.map(async (voter, idx) => {
        if (voter) {
          let votes = await this.getUserVotes(voter);
          sumAyes += votes;
        }
      })
    );
    await Promise.all(
      nays.map(async (voter, idx) => {
        if (voter) {
          let votes = await this.getUserVotes(voter);
          sumNays += votes;
        }
      })
    );
    return { sumAyes, sumNays };
  }
  /**
   * Asynchronous method for fetching the votes a specific user has in a legislature.
   * @param {*} voter
   * @returns
   */
  async getUserVotes(voter) {
    var positions = this.voteInfo.positions;
    var votes = 0;
    var usr = new User(voter);
    await usr.updateUserInfo();
    if (usr.userInfo) {
      var usrOffice = usr.userInfo.office;
    }
    positions.map((position) => {
      if (usrOffice == position.id) {
        switch (position.type) {
          case "singleSeat":
            votes += position.votePower;
            break;
          case "multipleSeats":
            votes += usr.userInfo.officeSeats;
            break;
          default:
            votes += position.votePower;
        }
      }
    });
    return votes;
  }
  /**
   * Method for getting an array of voters (name, id, state, office, votes, etc);
   * @param {*} arr
   * @returns Array of voter information.
   */
  async getVoters(arr) {
    var arr = eval(arr);
    var newArr = [];
    await Promise.all(
      arr.map(async (voter, idx) => {
        var user = new User(voter);
        await user.updateUserInfo();
        if (user.userInfo) {
          var obj = {
            politicianName: user.userInfo.politicianName,
            id: user.userInfo.id,
            state: user.userInfo.state,
            votes: await this.getUserVotes(voter),
            office: getUserLegislativePosition(this.voteInfo.positions, user.userInfo.office),
          };
          newArr.push(obj);
        }
      })
    );
    return newArr;
  }
  async getVoteAction() {
    var action = this.voteInfo.actions;
    var str = "boobs";
    switch (action.action) {
      case "renameLegislature":
        if (action.originalName && action.renameTo) {
          str = `<span class='redFont'>Rename Legislature</span>: <u>${action.originalName}</u> to <u>${action.renameTo}</u>`;
          break;
        }
    }
    return str;
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
