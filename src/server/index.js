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


app.get("/api/init",(req,res)=>{
    // Initialize session data
    if(req.session.playerData == null){
        req.session.playerData = {};
        req.session.loggedIn = false;
    }
    //
    console.log(req.session.playerData);
})



app.use(express.static('dist'));
app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));


