class Legislature {
  constructor(legislatureId) {
    this.legislatureId = legislatureId;
    this.legislatureInfo = undefined;
  }
  async fetchLegislatureInformation() {
    var db = require("../../db");
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM legislatures WHERE id = ?", [this.legislatureId], (err, results) => {
        if (err) {
          resolve({ error: "Error fetching legislature." });
        } else {
          var legislature = results[0];
          resolve(legislature);
        }
      });
    });
  }
  async updateLegislatureInformation() {
    var legislatureInfo = await this.fetchLegislatureInformation();
    this.legislatureInfo = legislatureInfo;
  }

  async userCanProposeVote(userOffice) {
    var rtn = false;
    if (userOffice != 0) {
      var db = require("../../db");
      var legislatureId = this.legislatureId;
      var position = await new Promise((resolve, reject) => {
        db.query("SELECT * FROM legislaturePositions WHERE id = ? AND legislatureId = ?", [userOffice, legislatureId], (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results[0]);
          }
        });
      });
      if (position) {
        if (eval(position.abilities).includes("proposeVote")) {
          rtn = true;
        }
      }
    }
    return rtn;
  }
}

module.exports = Legislature;
