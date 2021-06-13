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
    static async userDoesExist(userName){
        let database = require('../db');
        const sql = "SELECT * FROM users WHERE politicianName = " + database.escape(userName);
        return new Promise(function(resolve, reject){
            database.query(sql,
                function(err,rows){
                    if(err) reject(new Error(err));
                    resolve(rows.length);
                })
        })
    }
    static async userDoesExistId(userId){
        let database = require('../db');
        const sql = "SELECT * FROM users WHERE id = " + database.escape(userId);
        return new Promise(function(resolve, reject){
            database.query(sql,
                function(err,rows){
                    if(err) reject(new Error(err));
                    resolve(rows.length);
                })
        })
    }
}
module.exports = User