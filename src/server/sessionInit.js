const session = require('express-session');
const logger = require("node-color-log");


try{
    const serverConfig = require('./configFiles/serverConfig.json');
    var configDetails = {
        name:'AUTHSESSION',
        secret:serverConfig.cookieSecret,
        cookie:{
            secure:serverConfig.isSecure
        },
        resave:false,
        saveUninitialized:false
    }
}
catch(e){
    logger.color('red').bold().log("[session] serverConfig.json does not exist! Use serverConfigExample.js as a template!");
    return;
}

var sessionInit = session(configDetails);

module.exports = sessionInit;

