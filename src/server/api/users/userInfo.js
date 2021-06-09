var express=require('express');
var router=express.Router();
var isnumber = require('is-number');


const public_information = function(userRow){
    delete userRow.password;
    delete userRow.regCookie;
    delete userRow.currentCookie;
    delete userRow.regIP;
    delete userRow.currentIP;
    return userRow;
}


router.get('/fetchUserById/:userId',function(req,res){
    let database = require('../../db');
    let userId = req.params.userId;
    // Only accept user IDs
    if(isnumber(userId)){
        let sql = "SELECT * FROM users WHERE id = " + database.escape(userId);
        database.query(sql,function(err,result){
            try{
                // Person looking at their own data                  or if whoever is looking is an admin
                if(req.session.playerData.loggedInId == result[0].id || req.session.playerData.isAdmin == 1){
                    var userRow = result[0];
                }
                else{
                    var userRow = public_information(result[0]);
                }
                res.send(userRow);  
            }
            catch(exception){
                res.sendStatus(404);
            }
        })
    }
    else{
        res.sendStatus(400);
    }
})

module.exports.router=router;
