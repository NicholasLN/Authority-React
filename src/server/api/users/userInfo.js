var express = require('express');
var router = express.Router();
var isnumber = require('is-number');
var { boolean } = require('boolean');

const Party = require('../../classes/Party/Party');
const User = require('../../classes/User');
const State = require('../../classes/State/State');

const public_information = function (userRow) {
    delete userRow.username;
    delete userRow.password;
    delete userRow.regCookie;
    delete userRow.currentCookie;
    delete userRow.regIP;
    delete userRow.currentIP;
    return userRow;
}

router.get('/getLoggedInUser/:fetchParty?/:fetchState?/:sensitive?', async function (req, res) {
    if(req.params.fetchParty === undefined){ var fetchParty = true; } else { var fetchParty = boolean(req.params.fetchParty);}
    if(req.params.fetchState === undefined){ var fetchState = true; } else { var fetchState = boolean(req.params.fetchState);}
    if(req.params.sensitive === undefined){ var sensitive = false; } else { var sensitive = boolean(req.params.sensitive);}

    if (req.session.playerData != null && req.session.playerData.loggedIn) {
        var user = new User(req.session.playerData.loggedInId);
        var userInfo = await user.fetchUserInfo().then((response) => {return response[0]}).catch(error=>{return undefined});

        if(userInfo){
            if (userInfo.party != 0) {
                var party = new Party(userInfo.party);
                userInfo.partyInfo = await party.fetchPartyInfo().then((response) => { return response[0] });
            }
            if(!sensitive){ userInfo = public_information(userInfo); }
            // If (in params) they want to add party data.
            if(fetchParty && userInfo.party != 0){ 
                const party = new Party(userInfo.party);
                var partyInfo = await party.fetchPartyInfo().then((result)=>{return result[0]}).catch(error=>{console.log(error); return undefined});
                partyInfo.partyRoles = JSON.parse(partyInfo.partyRoles);
                userInfo.partyInfo = partyInfo;
            }
            // If (in params) they want to add state data.
            if(fetchState && (userInfo.state != "" || userInfo.state != undefined)){
                const state = new State(userInfo.state);
                var stateInfo = await state.fetchStateInfo().then((result)=>{return result[0]}).catch(error=>{console.log(error); return undefined});
                userInfo.stateInfo = stateInfo;
            }
            res.send(userInfo);
        }
        else{
            res.sendStatus({error:"User does not exist. Invalidating session data."});
            req.session.playerData.loggedIn = false;
            req.session.playerData.loggedInId = 0;
            req.session.playerData.cookie = 0;
        }
    }
    else {
        res.sendStatus(404);
    }
})

router.get('/fetchUserById/:userId/:fetchParty?/:fetchState?', async function (req, res) {
    if(req.params.fetchParty === undefined){ var fetchParty = false; } else { var fetchParty = boolean(req.params.fetchParty);}
    if(req.params.fetchState === undefined){ var fetchState = false; } else { var fetchState = boolean(req.params.fetchState);}

    let database = require('../../db');
    let userId = req.params.userId;
    // Only accept user IDs
    if (isnumber(userId)) {
        const user = new User(userId);
        //
        var userInfo = await user.fetchUserInfo().then((result)=>{return result[0]}).catch(error=>{return undefined});
        // If user is not found.
        if(!userInfo){ 
            res.send(404); 
        }
        else{
            if(!req.session.playerData || req.session.playerData.loggedInId != userInfo.id) { userInfo = public_information(userInfo); }

            // If (in params) they want to add party data.
            if(fetchParty && userInfo.party != 0){ 
                const party = new Party(userInfo.party);
                var partyInfo = await party.fetchPartyInfo().then((result)=>{return result[0]}).catch(error=>{console.log(error); return undefined});
                partyInfo.partyRoles = JSON.parse(partyInfo.partyRoles);
                userInfo.partyInfo = partyInfo;
            }
            // If (in params) they want to add state data.
            if(fetchState && (userInfo.state != "" || userInfo.state != undefined)){
                const state = new State(userInfo.state);
                var stateInfo = await state.fetchStateInfo().then((result)=>{return result[0]}).catch(error=>{console.log(error); return undefined});
                userInfo.stateInfo = stateInfo;
            }
            res.send(userInfo);
        }
    }
    else {
        res.sendStatus(400);
    }
})

module.exports.router = router;
