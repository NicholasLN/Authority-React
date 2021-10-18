"use strict";

const Party = require("./Party/Party");

class User {
  constructor(userId) {
    this.userID = userId;
  }
  async fetchUserInfo() {
    var id = this.userID;
    let database = require("../db");
    const sql = `
    SELECT
      *,
      IF(users.lastOnline > ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000) - ?, true, false) AS active
    FROM users
    WHERE id = ?`;
    return new Promise(function (resolve, reject) {
      database.query(sql, [process.env.ACTIVITY_THRESHOLD, id], function (err, result) {
        if (!result) {
          resolve(undefined);
        } else {
          resolve(result[0]);
        }
      });
    });
  }
  /**
   * Updates user information with DB results.
   */
  async updateUserInfo(attachPartyInfo = false) {
    this.userInfo = await this.fetchUserInfo();
    if (this.userInfo && this.userInfo.active == 1) {
      this.active = true;
    } else {
      this.active = false;
    }
    if (attachPartyInfo) {
      if (this.userInfo.party != 0) {
        var party = new Party(this.userInfo.party);
        await party.updatePartyInfo(true);
        this.userInfo.partyInfo = party.partyInfo;
      }
    }
  }
  /**
   *
   * @param {string} userName Name of the user we are verifying exists.
   * @returns {boolean} True/False depending on whether or not said user exists.
   */
  static async userDoesExist(userName) {
    let database = require("../db");
    const sql = "SELECT * FROM users WHERE politicianName = ?";
    return new Promise(function (resolve, reject) {
      database.query(sql, [userName], function (err, rows) {
        if (err) reject(new Error(err));
        resolve(rows.length);
      });
    });
  }
  /**
   * Same as userDoesExist, but with ID instead of name.
   * @param {*} userId
   * @returns
   */
  static async userDoesExistId(userId) {
    let database = require("../db");
    const sql = "SELECT * FROM users WHERE id = ?";
    return new Promise(function (resolve, reject) {
      database.query(sql, [userId], function (err, rows) {
        if (err) reject(new Error(err));
        resolve(rows.length);
      });
    });
  }
  /**
   *
   * @param {number} userId
   */
  static async updateLastOnline(userId) {
    let database = require("../db");
    let time = Date.now();
    database.query(`UPDATE users SET lastOnline = ? WHERE id = ?`, [time, userId], function (err, result) {
      if (err) throw err;
    });
  }
  static getUserLegislativePosition(positions, usrPosition) {
    var rtn = "none";
    positions.map((position) => {
      if (position.id == usrPosition) {
        rtn = position.officeName;
      }
    });
    return rtn;
  }
  /**
   * Method for obtaining user cosmetic information
   * @param {int} userId
   * @returns Array with cosmetic information
   */
  static async userCosmeticInfo(userId) {
    var user = new User(userId);
    await user.updateUserInfo();
    var userVars = {
      userPicture: null,
      userName: null,
      userState: null,
      userID: -1,
    };
    if (user.userInfo) {
      userVars.userPicture = user.userInfo.profilePic;
      userVars.userName = user.userInfo.politicianName;
      userVars.userState = user.userInfo.state;
      userVars.userID = user.userInfo.id;
    }
    return userVars;
  }

  static async getActiveLegislatureVotes(authorId) {
    var db = require("../db");
    var activeVotes = await new Promise((resolve, reject) => {
      db.query("SELECT id FROM legislatureVotes WHERE author = ? AND ( passed = -1 OR passed = 2 ) AND fromLegislature = 0 AND fromVote = 0", [authorId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.length);
        }
      });
    });
    return activeVotes;
  }

  /**
   *
   * @param {String} variable Variable being updated.
   * @param {*} updateTo What variable is being updated to
   * @returns {number} 200 if query worked, 400 if not.
   */
  async updateUserVariable(variable, updateTo) {
    var database = require("../db");
    return new Promise((resolve, reject) => {
      database.query(`UPDATE users SET ${variable} = ? WHERE id = ?`, [updateTo, this.userID], async function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(200);
        }
      });
    });
  }
  /**
   * Ease of use method for updating user information within the DB. Does not work if column does not exist within the User table.
   * Must use corresponding data type, otherwise will return error.
   *  eg. updateUser("authority",50) -> returns userInfo object
   *  eg. updateUser("authority","fuck you shithead") -> returns error.
   *  eg. updateUser("thisColumnDoesntExist",99) -> returns error.
   * @param {String} variable Variable being updated.
   * @param {*} updateTo What variable is being updated to
   * @returns {Object} new user information.
   */
  async updateUser(variable, updateTo) {
    await this.updateUserInfo();
    var currentUserInfo = this.userInfo;
    if (currentUserInfo.hasOwnProperty(variable)) {
      var error;
      await this.updateUserVariable(variable, updateTo).catch((err) => {
        error = { error: "Update failed. Check variable type." };
      });
      if (!error) {
        await this.updateUserInfo();
        return this.userInfo;
      } else {
        return error;
      }
    } else {
      return { error: "Column does not exist in user table." };
    }
  }
}
module.exports = User;
