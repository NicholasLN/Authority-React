const timeAgo = require('time-ago');
function timeAgoString(lastOnline){
    let now = Date.now();
    let difference = (Math.abs(now - lastOnline) / 60000).toFixed(2);

    if(difference > 10){
        return "Last online " + timeAgo.ago(new Date(parseInt(lastOnline)))
    }
    else{
        return "Online Now";
    }
}

module.exports = {
    timeAgoString
}