var dotenv = require("dotenv");
var express = require("express");
var router = express.Router();

const multer = require("multer");
const upload = multer();
var firebase = require("firebase");
const Party = require("../../classes/Party/Party");
const { userHasPerm } = require("../../classes/Party/Methods");

function exportFirebase() {
  if (!firebase.apps.length) {
    firebase.initializeApp({
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
    });
  } else {
    firebase.app(); // if already initialized, use that one
  }
  return firebase;
}
/**
 * Utility function for adding an image to Firebase and returning a value.
 * @param {ArrayBuffer} file The file being uploaded. Must be an array buffer.
 * @param {string} directory The directory the image is being uploaded to (Absolute)
 * @param {string} metadata Additional metadata for the file.
 * @returns
 */
async function uploadFileToFirebase(file, directory, metadata) {
  var firebase = exportFirebase();
  var storage = firebase.storage();
  var storageRef = storage.ref();

  var uploadTask = storageRef.child(`${directory}`).put(file, metadata);
  var url = await uploadTask.snapshot.ref.getDownloadURL();
  return url;
}

router.post("/postCustomPicture", upload.single("picture"), async function (req, res) {
  if (req.session.playerData.admin == 1) {
    var { directory, metaData } = req.body;
    if (metaData) {
      metaData = JSON.parse(metaData);
    } else {
      metaData = {};
    }
    metaData.contentType = req.file.mimetype;
    var url = await uploadFileToFirebase(req.file.buffer, directory, metaData);
    res.send(url);
  } else {
    res.send(404);
  }
});

router.post("/newUserImg", upload.single("picture"), async function (req, res) {
  if (req.session.playerData.loggedIn) {
    var mb = (req.file.size / (1024 * 1024)).toFixed(2);
    if (mb <= process.env.FIREBASE_MAX_UPLOAD_SIZE) {
      var url = await uploadFileToFirebase(req.file.buffer, `userPics/${req.session.playerData.loggedInId}`, { contentType: req.file.mimetype, cacheControl: "public,max-age=86400" });
      res.send(url);
    } else {
      res.send({ error: `Image is too large. (~${mb}mb)` });
    }
  } else {
    res.send({ error: "Not logged in." });
  }
});

router.post("/newPartyImg", upload.single("picture"), async function (req, res) {
  if (req.session.playerData.loggedIn) {
    var party = new Party(req.session.playerData.loggedInInfo.party);
    await party.updatePartyInfo();
    if (userHasPerm(req.session.playerData.loggedInId, party.partyInfo, "leader")) {
      var mb = (req.file.size / (1024 * 1024)).toFixed(2);
      if (mb <= process.env.FIREBASE_MAX_UPLOAD_SIZE) {
        var url = await uploadFileToFirebase(req.file.buffer, `partyPics/${party.partyID}`, { contentType: req.file.mimetype, cacheControl: "public,max-age=86400" });
        var partyInfo = await party.updateParty("partyPic", url);
        res.send(partyInfo);
      } else {
        res.send({ error: `Image is too large. (~${mb}mb)` });
      }
    } else {
      res.send({ error: "Not leader of party." });
    }
  } else {
    res.send({ error: "Not logged in." });
  }
});

module.exports.router = router;
