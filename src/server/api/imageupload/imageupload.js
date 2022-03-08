var express = require("express");
var router = express.Router();

const Party = require("../../classes/Party/Party");
const { userHasPerm } = require("../../classes/Party/Methods");
const { uploadImage } = require("../../helpers");

router.post("/postCustomPicture", async function (req, res) {
  if (req.session.playerData.admin == 1) {
    var { directory, metaData } = req.body;
    if (metaData) {
      metaData = JSON.parse(metaData);
    } else {
      metaData = {};
    }
    metaData.contentType = req.file.mimetype;
    var url = await uploadImage(req.file, directory, metaData);
    res.send({ url });
  } else {
    res.send(404);
  }
});

router.post("/newUserImg", async function (req, res) {
  // if (req.session.playerData.loggedIn) {
  //   var mb = (req.file.size / (1024 * 1024)).toFixed(2);
  //   if (mb <= process.env.MAX_UPLOAD_SIZE) {
  //     var url = await uploadImage(req.file, `users/${req.session.playerData.loggedInId}`).catch((err) => {
  //       res.send({ error: err });
  //     });
  //     res.send({ url });
  //   } else {
  //     res.send({ error: "Image too large." });
  //   }
  // } else {
  //   res.send({ error: "Not logged in." });
  // }
  res.send({error:"Image upload disabled for now."});
});

router.post("/newPartyImg", async function (req, res) {
  // if (req.session.playerData.loggedIn) {
  //   var party = new Party(req.session.playerData.loggedInInfo.party);
  //   await party.updatePartyInfo();
  //   if (userHasPerm(req.session.playerData.loggedInId, party.partyInfo, "leader")) {
  //     var mb = (req.file.size / (1024 * 1024)).toFixed(2);
  //     if (mb <= process.env.MAX_UPLOAD_SIZE) {
  //       var url = await uploadImage(req.file, `parties/${party.partyID}`).catch((err) => {
  //         res.send({ error: err });
  //       });
  //       var partyInfo = await party.updateParty("partyPic", url);
  //       res.send(partyInfo);
  //     } else {
  //       res.send({ error: "Image too large." });
  //     }
  //   } else {
  //     res.send({ error: "Not leader of party." });
  //   }
  // } else {
  //   res.send({ error: "Not logged in." });
  // }
  res.send({error:"Image upload disabled for now."})
});

module.exports.router = router;
