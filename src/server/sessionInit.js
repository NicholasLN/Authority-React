const cookieSession = require('cookie-session');
const logger = require("node-color-log");


try{
    const serverConfig = require('./configFiles/serverConfig.json');
    var configDetails = {
        name:'authSession',
        keys:[serverConfig.cookieSecret],
        secure:serverConfig.isSecure,
        maxAge: 24 * 60 * 60 * 1000,
    }
}
catch(e){
    logger.color('red').bold().log("[session] serverConfig.json does not exist! Use serverConfigExample.js as a template!");
    return;
}

var sessionInit = cookieSession(configDetails);

module.exports = sessionInit;

