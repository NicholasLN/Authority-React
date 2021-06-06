var mysql = require('mysql');

var server_configuration = requre('databaseConfig.json');
var con = mysql.createConnection(server_configuration);

con.connect(function(err) {
  if (err) throw err;
});

con.on('error', err => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log("SQL Timeout")
    } else {
        throw err;
    }
});

module.exports = con;