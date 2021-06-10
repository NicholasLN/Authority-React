var express=require('express');
var router=express.Router();
var isnumber = require('is-number');

router.get('/fetchPartyById/:partyId',function(req,res){
    let database = require('../../db');
    let partyId = req.params.partyId;

    if(isnumber(partyId)){

    }
});

module.exports.router = router;