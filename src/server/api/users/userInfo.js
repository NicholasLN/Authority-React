var express = require('express');
var router = express.Router();
var isnumber = require('is-number');

const Party = require('../../classes/Party');
const User = require('../../classes/User');

const public_information = function (userRow) {
    delete userRow.username;
    delete userRow.password;
    delete userRow.regCookie;
    delete userRow.currentCookie;
    delete userRow.regIP;
    delete userRow.currentIP;
    return userRow;
}

router.get('/getLoggedInUser', async function (req, res) {
    let database = require('../../db');
    if (req.session.playerData != null && req.session.playerData.loggedIn) {
        var user = new User(req.session.playerData.loggedInId);
        var userInfo = await user.fetchUserInfo().then((response) => { return response[0] });

        if (userInfo.party != 0) {
            var party = new Party(userInfo.party);
            userInfo.partyInfo = await party.fetchPartyInfo().then((response) => { return response[0] });
        }
        res.send(userInfo);
    }
    else {
        res.sendStatus(404);
    }
})


router.get('/fetchUserById/:userId', async function (req, res) {
    let database = require('../../db');
    let userId = req.params.userId;
    // Only accept user IDs
    if (isnumber(userId)) {
        const user = new User(userId);
        var userInfo = await user.fetchUserInfo().then((response) => { return response[0] })
        try {
            if (
                req.session.playerData == null
                ||
                req.session.playerData.loggedInId != userInfo.id
                &&
                req.session.playerData.isAdmin == 0
            ) {
                userInfo = public_information(userInfo);
            }
        }
        catch (exception) {
            res.send("User not found.");
            return
        }

        const party = new Party(userInfo.party);
        const partyInfo = await party.fetchPartyInfo().then((response) => { return response[0] })
        if (partyInfo) {
            userInfo.partyInfo = partyInfo
            userInfo.partyInfo.partyRoles = JSON.parse(userInfo.partyInfo.partyRoles);
        }
        else {
            userInfo.partyInfo = { error: "User not in party." };
        }

        res.send(userInfo);
    }
    else {
        res.sendStatus(400);
    }
})

module.exports.router = router;
