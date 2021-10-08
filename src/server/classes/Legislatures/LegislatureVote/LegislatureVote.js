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
      this.voteInfo.authorId = this.voteInfo.author;
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
      if (this.voteInfo.constitutional) {
        this.voteInfo.passThreshold = 66;
      } else {
        this.voteInfo.passThreshold = 51;
      }
      this.voteInfo.canVote = this.voteInfo.positions.map((position) => {
        return position.id;
      });
    }
  }
  async passPercentage() {
    if (this.voteInfo.constitutional == 1) {
      return ((this.voteInfo.sumAyes / (await this.getTotalPossibleVotes())) * 100).toFixed(2);
    } else {
      return ((this.voteInfo.sumAyes / (this.voteInfo.sumAyes + this.voteInfo.sumNays)) * 100).toFixed(2);
    }
  }

  /**
   * Method for getting the total possible number of votes for this bill.
   * Used for constitutional bills.
   * @returns {int} Sum of possible votes.
   */
  async getTotalPossibleVotes() {
    var sum = 0;
    var db = require("../../../db");
    await Promise.all(
      this.voteInfo.positions.map(async (position) => {
        if (position.type == "singleSeat") {
          var occupants = await new Promise((resolve, reject) => {
            db.query("SELECT id FROM users WHERE office = ?", [position.id], (err, results) => {
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
          if (obj.votes > 0) {
            newArr.push(obj);
          }
        }
      })
    );
    newArr.sort((a, b) => b.votes - a.votes);
    return newArr;
  }

  /**
   * @returns {boolean} Is the bill passing?
   */
  isPassing() {
    return this.voteInfo.passPercentage > this.voteInfo.passThreshold;
  }

  async getVoteAction() {
    var action = this.voteInfo.actions;
    var str = "";
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
    switch (this.voteInfo.status) {
      case -1:
        rtn = "Ongoing";
        break;
      case 0:
        rtn = "<span class='redFont'>Vote Failed</span>";
        break;
      case 1:
        rtn = "<span class='greenFont'>Vote Passed</span>";
        break;
      case 2:
        rtn = "<u>Waiting on other legislature.</u>";
        break;
    }
    return rtn;
  }

  async handleSuccess() {
    var db = require("../../../db");
    // If this is the original vote (not from the other legislatures)
    // This is mainly used to insert the same vote into the other legislatures, but it's also used for a unicameral government.
    if (this.voteInfo.fromLegislature == 0 && this.voteInfo.status != 2) {
      let countryId = this.legislatureInfo.countryId;
      var otherLegislatures = await new Promise(function (resolve, reject) {
        db.query("SELECT * FROM legislatures WHERE countryId = ?", [countryId], function (err, results) {
          if (err) {
            reject(err);
          } else {
            resolve({ length: results.length, results: results });
          }
        });
      });
      if (otherLegislatures.length > 0) {
        await this.updateLegislatureVoteVariable("passed", 2);
        await this.updateLegislatureVoteVariable("status", 2);
        // TODO: Handle bill action.
        // Here we will insert it into other legislatures.
        otherLegislatures.results.map(async (legislature) => {
          // Don't reinsert it into the same legislature.
          if (legislature.id != this.voteInfo.legislature) {
            var voteId = this.voteId;
            var fromLegislature = this.legislatureInfo.id;
            // Check if the bill is already in the legislature.
            var alreadyInLegislature = await new Promise(function (resolve, reject) {
              db.query("SELECT * FROM legislatureVotes WHERE fromLegislature = ? AND fromVote = ?", [fromLegislature, voteId], function (err, results) {
                if (err) {
                  reject(err);
                } else {
                  if (results.length > 0) {
                    resolve(true);
                  } else {
                    resolve(false);
                  }
                }
              });
            });

            // Add bill to other legislature.
            if (!alreadyInLegislature) {
              try {
                var actions = JSON.stringify(this.voteInfo.actions);
              } catch (Exception) {
                var actions = this.voteInfo.actions;
              }

              db.query(
                "INSERT INTO legislatureVotes (author, legislature, name, actions, expiresAt, status, constitutional, fromLegislature, fromVote) VALUES (?,?,?,?,?,?,?,?,?)",
                [this.voteInfo.authorId, legislature.id, this.voteInfo.name, actions, Date.now() + 24 * 60 * 60 * 1000, -1, this.voteInfo.constitutional, this.voteInfo.legislature, this.voteInfo.id],
                function (err, results) {
                  if (err) {
                    console.log(err);
                  }
                }
              );
            }
          }
        });
      }
    }
    // If the vote is from another legislature.
    else {
      console.log(this.voteInfo.id);
      var voteId = this.voteInfo.fromVote;
      var votes = await new Promise(function (resolve, reject) {
        db.query("SELECT * FROM legislatureVotes WHERE id = ? OR fromVote =?", [voteId, voteId], function (err, results) {
          if (err) {
            reject(err);
          } else {
            resolve({ length: results.length, results: results });
          }
        });
      });

      var passing = 0;
      var failed = 0;

      await Promise.all(
        votes.results.map(async (vote) => {
          var thisVote = new LegislatureVote(vote.id);
          await thisVote.updateVoteInformation();
          if (Date.now() > thisVote.voteInfo.expiresAt) {
            // If the vote is passing.
            if (thisVote.isPassing()) {
              passing++;
              if (thisVote.voteInfo.status != 2) {
                thisVote.updateLegislatureVoteVariable("status", 2);
              }
              // This only happens if the legislature doesn't require a vote.
            } else if (eval(thisVote.legislatureInfo.rules).includes("notRequired") && thisVote.voteInfo.sumAyes + thisVote.voteInfo.sumNays == 0) {
              passing++;
            } else {
              failed++;
            }
          }
        })
      );

      // If any one bill fails in any of the legislature, fail them all.
      if (failed > 0) {
        await Promise.all(
          votes.results.map(async (vote) => {
            var thisVote = new LegislatureVote(vote.id);
            await thisVote.updateLegislatureVoteVariable("status", 0);
            await thisVote.updateLegislatureVoteVariable("passed", 0);
          })
        );
      }

      // If no bills failed and they've all passed, and they're all past the expiration, success. Handle vote action.
      if (failed == 0 && passing == votes.length) {
        // TODO: Handle Action.
        await Promise.all(
          votes.results.map(async (vote) => {
            var thisVote = new LegislatureVote(vote.id);
            await thisVote.updateLegislatureVoteVariable("status", 1);
            await thisVote.updateLegislatureVoteVariable("passed", 1);
          })
        );
      }
    }
  }
  /**
   *
   * @param {String} variable Variable being updated.
   * @param {*} updateTo What variable is being updated to
   * @returns {number} 200 if query worked, 400 if not.
   */
  async updateLegislatureVoteVariable(variable, updateTo) {
    var database = require("../../../db");
    return new Promise((resolve, reject) => {
      database.query(`UPDATE legislatureVotes SET ${variable} = ? WHERE id = ?`, [updateTo, this.voteId], async function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(200);
        }
      });
    });
  }

  /**
   * Ease of use method for updating party vote information within the DB. Does not work if column does not exist within the partyVotes table.
   * Must use corresponding data type, otherwise will return error.
   *  eg. updateLegislatureVote("nays",[1,2,3]) -> returns voteInfo object
   *  eg. updateLegislatureVote("nays","fuck you shithead") -> returns error.
   *  eg. updateLegislatureVote("thisColumnDoesntExist",99) -> returns error.
   * @param {String} variable Variable being updated.
   * @param {*} updateTo What variable is being updated to
   * @returns {Object} new vote information.
   */
  async updateLegislatureVote(variable, updateTo) {
    await this.updateVoteInformation();
    var currentLegislatureVoteInfo = this.voteInfo;
    if (currentLegislatureVoteInfo.hasOwnProperty(variable)) {
      var error;
      await this.updateLegislatureVoteVariable(variable, updateTo).catch((err) => {
        console.log(err);
        error = { error: "Update failed. Check variable type." };
      });
      if (!error) {
        await this.updateVoteInformation();
        return this.voteInfo;
      } else {
        return error;
      }
    } else {
      return { error: "Column does not exist in LV table." };
    }
  }
}

module.exports = LegislatureVote;
