var express=require('express');
var router=express.Router();
var bcrypt=require('bcryptjs');

router.get("/logout",function(req,res){
    req.session.playerData.loggedIn = false;
    req.session.playerData.loggedInId = 0;

    res.send(req.session.playerData);
})

router.post("/login",function(req,res){
    console.log()
    const providedUsername = req.body.username;
    const providedPassword = req.body.password;

    var db = require('../../db');
    var sql = "SELECT * FROM users WHERE username =" + db.escape(providedUsername);

    var userCheckQuery = db.query(sql, function(err,result){
        if(err){ throw err }
        else{
            // If the username they've provided exists and if the password matches.
            if(result.length == 1 && bcrypt.compareSync(providedPassword, result[0].password)){
                // Now we change the session data.
                if(req.session.playerData == null || !req.session.playerData.loggedIn){
                    req.session.playerData = {};
                    req.session.playerData.loggedIn = true;
                    req.session.playerData.loggedInId = result[0].id;
                    req.session.playerData.admin = 0;
                }
                if(result[0].admin == 1){
                    req.session.playerData.admin = 1;
                }
                res.send(req.session.playerData);
            }
            else{
                res.send({error:"Authentication failed."});
            }
        }
    })
})




module.exports.router = router;