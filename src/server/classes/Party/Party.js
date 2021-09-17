"use strict";
var each = require("foreach");
const User = require("../User");
const Methods = require("./Methods");

class Party {
  constructor(partyId) {
    this.partyID = partyId;
    this.partyInfo = null;
  }

  /**
   * @returns {Promise<Object>} Promise with party information.
   */
  async fetchPartyInfo() {
    var id = this.partyID;
    let database = require("../../db");
    const sql = "SELECT * FROM parties WHERE id = ?";
    return new Promise(function (resolve, reject) {
      database.query(sql, [id], function (err, rows) {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async totalPartyInfuence() {
    var db = require("../../db");
    var sql = `SELECT SUM(partyInfluence) as partyInfluenceSum FROM users WHERE party = ? AND lastOnline > ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000) - ?`;
    return new Promise((res, rej) => {
      db.query(sql, [this.partyID, process.env.ACTIVITY_THRESHOLD], (err, result) => {
        if (err) {
          rej(err);
        } else {
          res(result[0].partyInfluenceSum);
        }
      });
    });
  }

  /**
   * Asynchronous function for fetching party members.
   * @param {number} results Max # of results to fetch.
   * @returns {Promise} A promise with an array of users.
   */
  async fetchPartyMembers(results = 50) {
    var id = this.partyID;
    let database = require("../../db");
    var users = [];

    const sql = `SELECT * FROM users WHERE party = ? LIMIT ?`;
    return new Promise(function (resolve, reject) {
      database.query(sql, [id, results], function (err, rows) {
        if (err) {
          reject(err);
        } else {
          //console.log(rows);
          rows.forEach(function (row) {
            let rowJSON = {
              politicianId: row.id,
              votingFor: row.partyVotingFor,
              influence: row.partyInfluence.toFixed(2),
            };
            users.push(rowJSON);
          });
          resolve(users);
        }
      });
    });
  }

  /**
   * Static asynchronous function for fetching the # of votes a user has.
   * @param {number} userId
   * @returns {number} Integer with # of voters.
   */
  static async getUserVotes(userId) {
    var database = require("../../db");
    return new Promise(function (resolve, reject) {
      database.query(`SELECT * FROM users WHERE partyVotingFor = ?`, [userId], function (err, rows) {
        if (err) {
          reject(new Error(err));
        } else {
          resolve(rows.length);
        }
      });
    });
  }

  static async doesPartyExist(party) {
    let db = require("../../db");
    let sql = `SELECT * FROM parties WHERE name OR id = ?`;
    return new Promise((resolve, reject) => {
      db.query(sql, [party], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results.length);
        }
      });
    });
  }

  /**
   * Asychronous function used to update the party information in the class at hand
   */
  async updatePartyInfo(parseRoles = false) {
    this.partyInfo = await this.fetchPartyInfo().then((result) => {
      if (parseRoles) {
        result[0].partyRoles = JSON.parse(result[0].partyRoles);
      }
      return result[0];
    });
    if (this.partyInfo) {
      this.partyInfo.totalPartyInfluence = await this.totalPartyInfuence();
    }
  }
  /**
   * Asynchronous function handling whenever a member leaves the party
   * @param {Int} memberID ID of member leaving the party
   * @returns 200 if member was successfully removed from their party
   */
  async memberLeave(memberID) {
    var partyInfo = this.partyInfo;
    var partyRoles = JSON.parse(partyInfo.partyRoles);

    each(partyRoles, function (role, roleTitle) {
      if (role.occupant == memberID) {
        role.occupant = 0;
      }
    });

    let database = require("../../db");
    const sql = `
    UPDATE parties SET partyRoles = ? WHERE id=?;
    UPDATE users SET party = 0, partyInfluence = 0, partyVotingFor = 0 WHERE id=?;
    UPDATE users SET partyVotingFor = 0 WHERE partyVotingFor=?`;
    return new Promise(function (resolve, reject) {
      database.query(sql, [JSON.stringify(partyRoles), partyInfo.id, memberID, memberID, memberID], function (err, results) {
        if (err) {
          reject(err);
        }
        resolve(200);
      });
    });
  }

  async voterPieChartData() {}

  /**
   * Asynchronous function handling whenever a member joins the party
   * @param {Int} memberID ID of member joining the party
   * @returns 200 if member was successfully added to the party
   */
  async memberJoin(memberID) {
    await this.updatePartyInfo();
    var partyInfo = await this.partyInfo;
    let database = require("../../db");
    const sql = `UPDATE users SET party = ? WHERE id = ?`;
    return new Promise(function (resolve, reject) {
      database.query(sql, [partyInfo.id, memberID], async (err, result) => {
        if (err) {
          reject(err);
        }
        if (result) {
          resolve(200);
        }
      });
    });
  }

  async getRole(role, nameOrId, returnType = "role") {
    var rtn;
    if (this.partyInfo == null) {
      await this.updatePartyInfo(true);
    } else {
      each(this.partyInfo.partyRoles, (thisRole, key) => {
        if (nameOrId == "uniqueId") {
          if (thisRole.uniqueID == role) {
            if (returnType == "role") {
              rtn = role;
            } else if (returnType == "key") {
              rtn = key;
            }
          }
        } else if (nameOrId == "name") {
          if (key == role) {
            if (returnType == "role") {
              rtn = role;
            } else if (returnType == "key") {
              rtn = key;
            }
          }
        }
      });
    }
    return rtn;
  }

  /**
   * Function for changing the occupant of a role
   * @param {Int} uniqueID The unique ID of the role.
   * @param {Int} newOccupant The CharID of the new occupant
   */
  async changeOccupant(uniqueID, memberID) {
    var partyInfo = await this.partyInfo;
    var newRoleInfo = Methods.changeOccupant(partyInfo, uniqueID, memberID);
    let db = require("../../db");
    var sql = `UPDATE parties SET partyRoles = ? WHERE id = ?`;

    return new Promise((resolve, reject) => {
      db.query(sql, [JSON.stringify(newRoleInfo), partyInfo.id], async (err, result) => {
        if (err) {
          reject(err);
        }
        if (result) {
          // Make sure to update if there needs to be several consecutive changes.
          await this.updatePartyInfo();
          resolve(200);
        }
      });
    });
  }

  async changeRolePerms(uniqueId, newPerms) {
    var newRoleInfo = Methods.changePerms(this.partyInfo, uniqueId, newPerms);
    await this.updateParty("partyRoles", JSON.stringify(newRoleInfo));
  }

  async deleteRole(uniqueId) {
    var newRoleInfo = Methods.deleteRole(this.partyInfo, uniqueId);
    await this.updateParty("partyRoles", JSON.stringify(newRoleInfo));
  }

  /**
   *
   * @param {String} variable Variable being updated.
   * @param {*} updateTo What variable is being updated to
   * @returns {number} 200 if query worked, 400 if not.
   */
  async updatePartyVariable(variable, updateTo) {
    var database = require("../../db");
    return new Promise((resolve, reject) => {
      database.query(`UPDATE parties SET ${variable} = ? WHERE id = ?`, [updateTo, this.partyID], async function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(200);
        }
      });
    });
  }
  /**
   * Ease of use method for updating party information within the DB. Does not work if column does not exist within the User table.
   * Must use corresponding data type, otherwise will return error.
   *  eg. updateParty("votes",50) -> returns partyInfo object
   *  eg. updateParty("votes","fuck you shithead") -> returns error.
   *  eg. updateParty("thisColumnDoesntExist",99) -> returns error.
   * @param {String} variable Variable being updated.
   * @param {*} updateTo What variable is being updated to
   * @returns {Object} new party information.
   */
  async updateParty(variable, updateTo) {
    await this.updatePartyInfo();
    var currentPartyInfo = this.partyInfo;
    if (currentPartyInfo.hasOwnProperty(variable)) {
      var error;
      await this.updatePartyVariable(variable, updateTo).catch((err) => {
        error = { error: "Update failed. Check variable type." };
      });
      if (!error) {
        await this.updatePartyInfo();
        return this.partyInfo;
      } else {
        return error;
      }
    } else {
      return { error: "Column does not exist in user table." };
    }
  }
}
module.exports = Party;
