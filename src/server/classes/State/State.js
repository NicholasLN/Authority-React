"use strict";

class State {
  constructor(abbreviation) {
    this.abbreviation = abbreviation;
  }
  async fetchStateInfo() {
    var abbreviation = this.abbreviation;
    let database = require("../../db");
    const sql = `SELECT * FROM states WHERE abbreviation = ? OR name = ?`;
    return new Promise(function (resolve, reject) {
      database.query(sql, [abbreviation, abbreviation], function (err, result) {
        if (result === undefined) {
          reject({ error: "No state with that abbreviation/name" });
        } else {
          resolve(result[0]);
        }
      });
    });
  }
  async updateStateInfo() {
    this.stateInfo = await this.fetchStateInfo();
  }
}
module.exports = State;
