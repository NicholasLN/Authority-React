const cron = require("node-cron");

// At minute 0 of every hour
cron.schedule("0 * * * *", async () => {
  // Party Position Drift
  require("./partyPositionDrift");
  // Party Power Increase
  require("./partyPower");
});
