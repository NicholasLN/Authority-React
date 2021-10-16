var cron = require("node-cron");

function requireUncached(module) {
  delete require.cache[require.resolve(module)];
  return require(module);
}
////////////////////////////////////////////////////////////////
////////////////////////CRON JOBS///////////////////////////////
////////////////////////////////////////////////////////////////
/// every minute ///
cron.schedule("* * * * *", async () => {
  // Party vote check
  requireUncached("./cronTasks/one_minute_interval/partyVoteCheck");
  // Legislature vote check.
  requireUncached("./cronTasks/one_minute_interval/legislatureVoteCheck");
});
/// every hour ///
cron.schedule("0 * * * *", async () => {
  // Party Position Drift
  requireUncached("./cronTasks/one_hour_interval/partyPositionDrift");
  // Party Power Increase
  requireUncached("./cronTasks/one_hour_interval/partyPower");
});
////////////////////////////////////////////////////////////////
////////////////////////END CRON ///////////////////////////////
////////////////////////////////////////////////////////////////
