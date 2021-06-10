// Going to be using this mainly for debug needs. Liberals owned.
var dotenv = require('dotenv');
var express=require('express');
var router=express.Router();

if(process.env.ENVIRONMENT == "DEVELOPMENT"){
    
router.use("/loginAsUser/:userId",function(req,res){
    var userID = req.params.userId; 

    req.session.playerData = {};
    req.session.playerData.loggedIn = true;
    req.session.playerData.loggedInId = userID;

    res.sendStatus(200);
})


}

module.exports.router = router;