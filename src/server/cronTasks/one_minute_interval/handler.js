const cron = require("node-cron");

// At every minute
cron.schedule("* * * * *", async () => {
  require("./partyVoteCheck.js");
  // Party vote check
});
