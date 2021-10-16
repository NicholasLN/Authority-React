var CronJob = require("cron").CronJob;
// At every minute
var job = new CronJob(
  "* * * * *",
  async () => {
    // Party vote check
    require("./partyVoteCheck.js");

    // Legislature vote check.
    require("./legislatureVoteCheck");
  },
  null,
  true,
  "America/New_York"
);

job.start();
