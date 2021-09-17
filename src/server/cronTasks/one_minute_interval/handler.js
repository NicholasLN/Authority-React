const cron = require("node-cron");

// At every minute
require("./partyVoteCheck.js");
cron.schedule("* * * * *", async () => {
  // Party Position Drift
});
