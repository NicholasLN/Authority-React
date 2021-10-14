const cron = require("node-cron");

// At every minute
cron.schedule("* * * * *", async () => {
  console.log("cron 1 minute");
  // Party vote check
  require("./partyVoteCheck.js");

  // Legislature vote check.
  require("./legislatureVoteCheck");
});
