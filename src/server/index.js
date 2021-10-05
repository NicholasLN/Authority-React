const express = require("express");
const logger = require("node-color-log");
const path = require("path");
const User = require("./classes/User");
const { setSessionDefaults, randomString, public_information, remove_useless_information } = require("./classes/Misc/setSessionDefaults");

// RATE LIMIT MIDDLEWARE: https://www.npmjs.com/package/express-rate-limit
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 200, // limit each IP to 100 requests per windowMs
});

const multer = require("multer");
const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 * 1024,
  },
});

const app = express();

app.use(multerMid.single("file"));
app.use(limiter);
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));
/*  Initialize session which will be used for storing user data and the like. */
try {
  app.use(require("./sessionInit"));
  app.use((req, res, next) => {
    if (req.session.playerData == undefined) {
      setSessionDefaults(req);
      next();
    } else {
      next();
    }
  });
} catch (exception) {
  logger.color("red").bold().log("[session] Error initializing session. Read previous exception for more details. Shutting down server.");
  return;
}

const logOut = function (req) {
  req.session.playerData.loggedIn = false;
  req.session.playerData.loggedInId = 0;
};

app.get("/api/init", async (req, res) => {
  // Initialize session data
  if (req.session.playerData == null) {
    setSessionDefaults(req);
  } else {
    if (req.session.playerData.cookieID == null) {
      req.session.playerData.cookieID = randomString(16);
    }
  }
  //
  if (req.session.playerData.loggedIn) {
    let userDoesExist = await User.userDoesExistId(req.session.playerData.loggedInId);
    if (userDoesExist) {
      User.updateLastOnline(req.session.playerData.loggedInId);
      var user = new User(req.session.playerData.loggedInId);
      await user.updateUserInfo(true);
      if (user.userInfo) {
        req.session.playerData.loggedInInfo = remove_useless_information(user.userInfo);
      }
    } else {
      logOut(req);
    }
  }
  console.log(req.session.playerData);
  res.send(req.session.playerData);
});

// AUTH
app.use("/api/auth", require("./api/auth/authRoutes").router);
// GET USER INFO
app.use("/api/userinfo", require("./api/users/userInfo").router);
// UPDATE USER INFO
app.use("/api/useractions", require("./api/users/userActions").router);
// GET PARTY INFO
app.use("/api/partyinfo", require("./api/parties/partyinfo").router);
app.use("/api/partyvoteinfo", require("./api/parties/partyVotes/partyvoteinfo").router);
app.use("/api/partyvoteactions", require("./api/parties/partyVotes/partyvoteactions").router);
app.use("/api/partyactions", require("./api/parties/partyactions").router);
// GET STATE INFO
app.use("/api/stateinfo", require("./api/states/stateinfo").router);
// DEVELOPMENT ROUTES
app.use("/api/misc/development", require("./api/misc/development").router);
app.use("/api/imageupload", require("./api/imageupload/imageupload").router);
// DEMOGRAPHIC ROUTES
app.use("/api/demographicinfo", require("./api/demographics/demographicinfo").router);
// LEGISLATURES
app.use("/api/legislatureinfo", require("./api/legislatures/legislatureinfo").router);
// COUNTRIES
app.use("/api/countryinfo", require("./api/countries/countryinfo.js").router);

app.use((req, res, next) => {
  next();
});

app.use(express.static("dist"));

if (process.env.ENVIRONMENT == "PRODUCTION") {
  app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname + "../../../dist/index.html"));
  });
}

app.listen(process.env.PORT || 8080, () => {
  console.log(`Listening on port ${process.env.PORT || 8080}!`);
  require("./cronTasks/cron");
});
