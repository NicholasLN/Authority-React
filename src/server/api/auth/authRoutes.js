var express = require("express");
var router = express.Router();
var bcrypt = require("bcryptjs");
var User = require("../../classes/User");
const setSessionDefaults = require("../../classes/Misc/setSessionDefaults");
const { setSessionAuthorized } = require("../../classes/Misc/setSessionDefaults");
const requestIP = require("request-ip");
var validator = require("validator");

const fetchRowCount = async (sql, params) => {
  var db = require("../../db");
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows.length);
      }
    });
  });
};

router.get("/logout", function (req, res) {
  req.session.playerData.loggedIn = false;
  req.session.playerData.loggedInId = 0;
  req.session.playerData.loggedInInfo = null;
  req.session.playerData.admin = 0;

  res.send(req.session.playerData);
});

router.post("/login", function (req, res) {
  const { password, username } = req.body;
  var db = require("../../db");
  var sql = `SELECT * FROM users WHERE username = ?`;

  if (password) {
    if (username) {
      db.query(sql, [username], function (err, result) {
        if (err) {
          throw err;
        } else {
          // If the username they've provided exists and if the password matches.
          if (result) {
            console.log(result.length);
            if (result.length > 0) {
              var passwordMatches = bcrypt.compareSync(password, result[0].password);
              if (passwordMatches) {
                // Now we change the session data.
                setSessionAuthorized(req, result[0]);
                res.send(req.session.playerData);
              } else {
                res.send({ error: "Invalid username/password" });
              }
            } else {
              res.send({ error: "Invalid username/password" });
            }
          }
        }
      });
    } else {
      res.send({ error: "No username provided." });
    }
  } else {
    res.send({ error: "No password provided." });
  }
});

router.post("/register", async function (req, res) {
  var ip = requestIP.getClientIp(req);

  var cookieID = 0;
  if (req.session.playerData == null) {
    setSessionDefaults(req);
  }
  cookieID = req.session.playerData.cookieID;

  let db = require("../../db");
  var { username, password, email, politicianName, state, country, ecoPos, socPos } = req.body;
  if (validator.default.isEmail(email)) {
    email = email.toLowerCase();
    var matchingEmails = await fetchRowCount(`SELECT * FROM users WHERE email=?`, [email]);
    if (matchingEmails == 0) {
      let matchingUsers = await User.userDoesExist(politicianName);
      let salt = bcrypt.genSaltSync(10);
      let hash = bcrypt.hashSync(password, salt);
      if (matchingUsers == 0) {
        var sql = `INSERT INTO users 
        (username, password, email, regCookie, currentCookie, 
        regIP, currentIP, politicianName, lastOnline, state, 
        nation, ecoPos, socPos) 
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`;

        db.query(sql, [username, hash, email, cookieID, cookieID, ip, ip, politicianName, Date.now(), state, country, ecoPos, socPos], function (err, result) {
          if (err) throw err;
          req.session.playerData.loggedIn = true;
          req.session.playerData.loggedInId = result.insertId;

          res.send(req.session.playerData);
        });
      } else {
        res.send({ error: "Politician already exists!" });
      }
    } else {
      res.send({ error: "Email already claimed." });
    }
  } else {
    res.send({ error: "Invalid email!" });
  }
});

router.post("/setUserImage", function (req, res) {
  if (req.session.playerData) {
    if (req.session.playerData.loggedIn) {
      var db = require("../../db");
      var sql = `UPDATE users SET profilePic=? WHERE id=?`;
      db.query(sql, [req.body.pictureUrl, req.session.playerData.loggedInId], function (err, response) {
        if (err) throw err;
        else {
          res.sendStatus(200);
        }
      });
    }
  }
});

router.post("/setUserBio", function (req, res) {
  if (req.session.playerData) {
    if (req.session.playerData.loggedIn) {
      if (req.body.bio.length < 2500) {
        let db = require("../../db");
        var sql = `UPDATE users SET bio=? WHERE id=?`;
        db.query(sql, [req.body.bio, req.session.playerData.loggedInId], function (err, response) {
          if (err) throw err;
          else {
            res.sendStatus(200);
          }
        });
      }
    }
  }
});

module.exports.router = router;
