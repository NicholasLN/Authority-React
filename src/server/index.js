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
    res.send("OK");
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



app.use(express.static('dist'));
app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));


