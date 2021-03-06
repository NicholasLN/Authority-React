const cookieSession = require("cookie-session");
const logger = require("node-color-log");
const { randomString } = require("./classes/Misc/setSessionDefaults");
const dotenv = require("dotenv").config();

if (process.env.SESSION_SECURE == "false") {
  var secureSession = false;
} else {
  var secureSession = true;
}

try {
  if (process.env.ENVIRONMENT.toLowerCase() != "development") {
    var configDetails = {
      name: `${randomString(12)}`,
      keys: [process.env.COOKIE_SECRET],
      secure: secureSession,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "strict",
    };
  } else {
    var configDetails = {
      name: `authDev`,
      keys: [process.env.COOKIE_SECRET],
      secure: secureSession,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "strict",
    };
  }
} catch (e) {
  logger.color("red").bold().log("[session] serverConfig.json does not exist! Use serverConfigExample.js as a template!");
  return;
}

var sessionInit = cookieSession(configDetails);

module.exports = sessionInit;
