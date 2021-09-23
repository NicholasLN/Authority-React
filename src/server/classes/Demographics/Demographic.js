class Demographic {
  constructor(demographic) {
    this.demographicId = demographic;
  }
  static async grabPoliticalShare(demoId, stringOrSoc) {
    var db = require("../../db");
    return new Promise(db.query("SELECT `-5`,`-4`,`-3`,`-2`,`-1`,`0`,`1`,`2`,`3`,`4`,`5` FROM demoPositions WHERE demoID = ? AND type = ?"), [demoId, stringOrSoc], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result[0]);
      }
    });
  }
}

module.exports = Demographic;
