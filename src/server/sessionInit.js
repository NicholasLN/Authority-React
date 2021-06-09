const cookieSession = require('cookie-session');
const logger = require("node-color-log");
const dotenv = require('dotenv').config();

try{
    var configDetails = {
        name:'authSession',
        keys:[process.env.COOKIE_SECRET],
        secure:process.env.SESSION_SECURE,
        maxAge: 24 * 60 * 60 * 1000,
    }
}
catch(e){
    logger.color('red').bold().log("[session] serverConfig.json does not exist! Use serverConfigExample.js as a template!");
    return;
}

var sessionInit = cookieSession(configDetails);

module.exports = sessionInit;

