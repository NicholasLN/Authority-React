var mysql = require('mysql');
const logger = require('node-color-log');
var dotenv = require('dotenv').config();

try{
    var server_configuration = {
        host:process.env.DB_HOST,
        user:process.env.DB_USER,
        database:process.env.DB_DB,
        password:process.env.DB_PASSWORD
    }
}
catch(e){
    logger.color('red').bold().log(e);
}
var con = mysql.createPool(server_configuration);

// This is merely a test query for validating correct credentials.
con.query('SELECT 1 + 1 AS solution', (error, results, fields) => {
    if (error){
        if(error.code== 'ER_ACCESS_DENIED_ERROR'){
            logger.color('red').bold().log("[mySQL] Incorrect DB Credentials! Check DB config details.");
        }
    }
  })

con.on('error', err => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        //con = mysql.createConnection(server_configuration);
    } else {
        throw err;
    }
});

module.exports = con;