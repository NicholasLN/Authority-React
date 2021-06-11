var express=require('express');
var router=express.Router();

router.get("/logout",function(req,res){
    req.session.playerData.loggedIn = false;
    req.session.playerData.loggedInId = 0;

    res.send(200);
})

module.exports.router = router;