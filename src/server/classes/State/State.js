'use strict'

class State{
    constructor(abbreviation){
        this.abbreviation = abbreviation;
    }
    async fetchStateInfo(){
        var abbreviation = this.abbreviation;
        let database = require('../../db');
        const sql = "SELECT * FROM states WHERE abbreviation = " + database.escape(abbreviation);
        return new Promise(function(resolve, reject){
            database.query(
                sql,
                function(err, rows){                                                
                    if(rows === undefined){
                        reject(new Error("No state under that abbreviation"));
                    }else{
                        resolve(rows);
                    }
                }
            )}
        );
    }
}
module.exports = State