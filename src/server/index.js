const express = require('express');
const session = require('express-session');
const logger = require('node-color-log');

const app = express();


/*  Initialize session which will be used for storing user data and the like. */
try{
    app.use(require('./sessionInit'));
}
catch(exception){
    logger.color('red').bold().log("[session] Error initializing session. Read previous exception for more details. Shutting down server.");
    return;
}


app.get("/",(req,res)=>{
    req.session.cum = "cum";
    console.log(req.session);
    res.send("Hello!");
})


app.use(express.static('dist'));
app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));


