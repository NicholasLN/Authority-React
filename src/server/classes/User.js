'use strict'

class User{
    constructor(userId){
        this.userID = userId;
    }
    async fetchUserInfo(){
        var id = this.userID;
        let database = require('../db');
        const sql = "SELECT * FROM users WHERE id = " + database.escape(id);
        return new Promise(function(resolve, reject){
            database.query(
                sql,
                function(err, rows){          
                    if(rows === undefined){
                        reject(new Error("No user under that ID"));
                    }else{
                        resolve(rows);
                    }
                }
            )}
        );
    }
}
module.exports = User