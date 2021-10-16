var CronJob = require("cron").CronJob;

// At minute 0 of every hour
var job = new CronJob(
  "* * * * *",
  async () => {
    // Party Position Drift
    require("./partyPositionDrift");
    // Party Power Increase
    require("./partyPower");
  },
  null,
  true,
  "America/New_York"
);
job.start();
