const md5 = require("md5");
var chars = `!@#$%^&*()_+{}|:qwertyuiop[]asdfghjkl;zxcvbnm,./QWERTYUIOPASDFGHJKLZXCVBNM `;

const public_information = function (userRow) {
  delete userRow.username;
  delete userRow.password;
  delete userRow.regCookie;
  delete userRow.currentCookie;
  delete userRow.regIP;
  delete userRow.currentIP;
  return userRow;
};
const remove_useless_information = function (userRow) {
  var userRow = public_information(userRow);
  delete userRow.bio;
  delete userRow.profilePic;
  delete userRow.lastOnline;
  return userRow;
};

function randomString(length) {
  var result = "";
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return "" + result + "";
}
function setSessionDefaults(req) {
  req.session.playerData = {};
  req.session.playerData.cookieID = randomString(18);
  req.session.playerData.loggedIn = false;
  req.session.playerData.loggedInId = 0;
}

function setSessionAuthorized(req, userRow) {
  if (req.session.playerData == null || !req.session.playerData.loggedIn) {
    req.session.playerData = {};
    req.session.playerData.cookieID = randomString(18);
    req.session.playerData.loggedIn = true;
    req.session.playerData.loggedInId = userRow.id;
    req.session.playerData.admin = 0;
    req.session.playerData.loggedInInfo = remove_useless_information(userRow);
  }
  if (userRow.admin == 1) {
    req.session.playerData.admin = 1;
  }
}

module.exports = {
  setSessionDefaults,
  setSessionAuthorized,
  randomString,
  remove_useless_information,
  public_information,
};
