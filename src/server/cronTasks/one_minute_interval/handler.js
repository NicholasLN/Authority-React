const cron = require("node-cron");

// At every minute
cron.schedule("* * * * *", async () => {
  console.log("sex");
  // Party vote check
  require("./partyVoteCheck.js");
});
