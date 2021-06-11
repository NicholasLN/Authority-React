'use strict'

class Party{
    constructor(partyId){
        this.partyID = partyId;
    }
    async fetchPartyInfo(){
        var id = this.partyID;
        let database = require('../../db');
        const sql = "SELECT * FROM parties WHERE id = " + database.escape(id);
        return new Promise(function(resolve, reject){
            database.query(
                sql,
                function(err, rows){                                                
                    if(rows === undefined){
                        reject(new Error("No party under that ID"));
                    }else{
                        resolve(rows);
                    }
                }
            )}
        );
    }
}
module.exports = Party