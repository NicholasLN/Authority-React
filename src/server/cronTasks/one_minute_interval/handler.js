const cron = require("node-cron");

// At every minute
cron.schedule("*/1 * * * *", async () => {
  // Party vote check
  require("./partyVoteCheck.js");
});
