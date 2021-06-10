const express = require('express');
const logger = require('node-color-log');
const cookieSession = require('cookie-session');
const app = express();


/*  Initialize session which will be used for storing user data and the like. */
try{
    app.use(require('./sessionInit'));
}
catch(exception){
    logger.color('red').bold().log("[session] Error initializing session. Read previous exception for more details. Shutting down server.");
    return;
}

// Default session variables.
const setSessionDefaults = function(req){
    req.session.playerData = {};
    req.session.playerData.loggedIn = false;
    req.session.playerData.loggedInId = 0;
}

app.get("/api/init",(req,res)=>{
    // Initialize session data
    if(req.session.playerData == null){
        setSessionDefaults(req);
    }
    //
    res.sendStatus(200);
})

app.get("/api/returnSessionData",(req,res)=>{
    if(req.session.playerData != null){
        res.send(req.session.playerData);
    }
    else{
        // If they somehow still don't have it...then set it. 
        setSessionDefaults(req);
        res.send(req.session.playerData);
    }
})

// GET USER INFO
app.use('/api/userinfo',require('./api/users/userInfo').router)
// GET PARTY INFO
app.use('/api/partyinfo',require('./api/parties/partyinfo').router);
// DEVELOPMENT ROUTES
app.use('/api/misc/development',require('./api/misc/development').router);


app.use(express.static('dist'));
app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));


