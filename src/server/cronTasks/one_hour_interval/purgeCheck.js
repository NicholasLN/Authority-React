async function completeThePurge(partyID) {
    var db = require("../../db");
    // Delete from partyPurges where timestamp < current time (Date.now())
    return new Promise((res, reject) => {
        db.query("DELETE FROM partyPurges WHERE timestamp < ?", [Date.now()], (err, results) => {
            if (err) {
                reject(err);
            } else {
                res(results);
            }
        });
    });
}
completeThePurge().then(() => {
});