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
}

module.exports = Legislature;
