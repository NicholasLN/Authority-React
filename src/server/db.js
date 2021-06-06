var mysql = require('mysql');
const logger = require('node-color-log');
try{
    var server_configuration = require('./databaseConfig.json');
}
catch(e){
    logger.color('red').bold().log("[mySQL] databaseConfig.json does not exist! Use databaseConfigExample.js as a template!");
    return;
}
var con = mysql.createConnection(server_configuration);


con.connect(function(err) {
    if(err){
        if (err.code === "ER_DBACCESS_DENIED_ERROR"){
            logger.color('red').bold().log("[mySQL] Incorrect DB Credentials! Check DB config details.");
        }
    }
});

con.on('error', err => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        logger.color('yellow').bold().log("[mySQL] SQL Timeout");
    } else {
        throw err;
    }
});

module.exports = con;