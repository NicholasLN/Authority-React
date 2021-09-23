const forEach = require("foreach");

class Demographic {
  constructor(demographic) {
    this.demographicId = demographic;
  }
  static grabPoliticalShare(demoId, stringOrSoc) {
    var db = require("../../db");

    var sql = "SELECT `-5`,`-4`,`-3`,`-2`,`-1`,`0`,`1`,`2`,`3`,`4`,`5` FROM demoPositions WHERE demoID = ? AND TYPE = ?";
    var params = [parseInt(demoId), stringOrSoc];

    return new Promise((resolve, reject) => {
      db.query(sql, params, (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result[0]);
      });
    });
  }
  static async demographicArrayPopShare(demoArray) {
    var sum = 0;
    var popArray = [];
    forEach(demoArray, (demo, demoId) => {
      popArray[demo.id] = {
        popShare: 0,
        demoInformation: demo,
      };
      sum += demo.population;
    });
    forEach(demoArray, (demo, demoId) => {
      let share = (demo.population / sum) * 100;
      popArray[demo.id].popShare = share;
    });
    return popArray;
  }
}

module.exports = Demographic;
