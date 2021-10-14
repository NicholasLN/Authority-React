const cron = require("node-cron");

// At every minute
cron.schedule("* * * * *", async () => {
  // Party vote check
  require("./partyVoteCheck.js");

  // Legislature vote check.
  require("./legislatureVoteCheck");
});
