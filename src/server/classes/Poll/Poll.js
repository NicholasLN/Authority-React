const { forEach } = require("async-foreach");
const { randomInt } = require("crypto");
const Demographic = require("../Demographics/Demographic");
const { demoSetPopulation } = require("../Demographics/Methods");
const DemographicSupport = require("../DemographicSupport/DemographicSupport");
var user = require("../User");
class Poll {
  constructor(demoArray, confidenceLevel, sampleSize, loggedInUser) {
    this.demoArray = demoArray;
    this.sampleSize = sampleSize;

    if (confidenceLevel > 99.999) {
      confidenceLevel = 99.999;
    }
    if (confidenceLevel < 0.999) {
      confidenceLevel = 0.999;
    }
    this.confidenceLevel = confidenceLevel;

    if (sampleSize > 1000) {
      sampleSize = 1000;
    }
    if (sampleSize < 10) {
      sampleSize = 10;
    }
    this.sampleSize = sampleSize;

    this.mean = 0;
    this.variance = 0;
    this.standardDeviation = 0;
    this.marginOfError = 0;

    /**
     * @type {User}
     */
    this.user = loggedInUser;
  }
  /**
   * Used for calculating probability at given confidence level.
   * @param {*} z Confidence Interval
   * @returns {float} Probability at specified confidence level
   */
  poz(z) {
    if (z === 0) {
      var x;
      x = 0.0;
    } else {
      var y;
      y = 0.5 * Math.abs(z);
      if (y > 6 * 0.5) {
        x = 1.0;
      } else {
        if (y < 1.0) {
          var w;
          w = y * y;
          x = x =
            ((((((((0.000124818987 * w - 0.001075204047) * w + 0.005198775019) * w - 0.019198292004) * w + 0.059054035642) * w - 0.151968751364) * w + 0.319152932694) * w - 0.5319230073) * w +
              0.797884560593) *
            y *
            2.0;
        } else {
          y -= 2.0;
          x =
            (((((((((((((-4.5255659e-5 * y + 0.00015252929) * y - 1.9538132e-5) * y - 0.000676904986) * y + 0.001390604284) * y - 0.00079462082) * y - 0.002034254874) * y + 0.006549791214) * y -
              0.010557625006) *
              y +
              0.011630447319) *
              y -
              0.009279453341) *
              y +
              0.005353579108) *
              y -
              0.002141268741) *
              y +
              0.000535310849) *
              y +
            0.999936657524;
        }
      }
    }
    return x;
  }
  /**
   * Calculate Z-Score for given probability.
   * @param {*} p Probability
   * @returns {float|int} Z-Score
   */
  z_score(p) {
    p /= 100;
    var Z_EPSILON;
    Z_EPSILON = 1.0e-6;
    var minZ;
    minZ = -6;
    var maxZ;
    maxZ = 6;
    var zVal;
    zVal = 0.0;
    if (p < 0.0 || p > 1.0) {
      return -1;
    }

    while (maxZ - minZ > Z_EPSILON) {
      var pVal;
      pVal = this.poz(zVal);
      if (pVal > p) {
        maxZ = zVal;
      } else {
        minZ = zVal;
      }
      zVal = (maxZ + minZ) * 0.5;
    }
    return zVal;
  }
  calcMOE(p) {
    var z;
    z = this.z_score(this.confidenceLevel);
    var pop;
    pop = demoSetPopulation(this.demoArray);
    var sampleSize;
    sampleSize = this.sampleSize;
    return (z * Math.sqrt(p * (1 - p))) / Math.sqrt(((pop - 1) * sampleSize) / (pop - sampleSize));
  }
  updateStandardDeviation() {
    this.standardDeviation = this.variance / this.sampleSize;
  }
  updateMarginOfError() {
    var p = this.mean / 100;
    this.marginOfError = parseFloat(this.calcMOE(p).toFixed(2)) * 100;
  }
  grabWeightedRandomPosition(positionShare) {
    var rand = randomInt(0, 100);
    var sum = 0;
    var selectedPosition = null;
    for (let i in positionShare) {
      if (i != "type" && i != "demoID") {
        sum += positionShare[`${i}`];
        if (sum >= rand) {
          selectedPosition = parseInt(i);
          break;
        }
      }
    }
    return selectedPosition;
  }
  grabWeightedRandomDemo(weightedPopArray) {
    var rand = randomInt(0, 100);
    var sum = 0;
    var selectedDemo = null;

    while (selectedDemo == null) {
      for (let i in weightedPopArray) {
        var details = weightedPopArray[i];
        sum += details.popShare;
        if (sum >= rand) {
          selectedDemo = details.demoInformation;
          break;
        }
      }
    }

    return selectedDemo;
  }
  populateQuestionArray(sampleArray) {
    var questionArray = {
      "I strongly dislike them": 0,
      "I dislike them": 0,
      "They're ok.": 0,
      "I like them.": 0,
      "I like them very much.": 0,
    };
    var questionArrayMOE = {
      "I strongly dislike them": 0,
      "I dislike them": 0,
      "They're ok.": 0,
      "I like them.": 0,
      "I like them very much.": 0,
    };
    sampleArray.map((value, i) => {
      this.variance += (value - this.mean) ** 2;
      switch (true) {
        case value <= 15:
          questionArray["I strongly dislike them"] = questionArray["I strongly dislike them"] + 1;
          break;
        case value > 15 && value <= 40:
          questionArray["I dislike them"] = questionArray["I dislike them"] + 1;
          break;
        case value > 40 && value <= 60:
          questionArray["They're ok."] = questionArray["They're ok."] + 1;
          break;
        case value > 60 && value <= 85:
          questionArray["I like them."] = questionArray["I like them."] + 1;
          break;
        case value > 85 && value <= 100:
          questionArray["I like them very much."] = questionArray["I like them very much."] + 1;
          break;
      }
    });
    Object.keys(questionArray).map((value, i) => {
      var respondents = questionArray[value];
      console.log(respondents);
      questionArrayMOE[value] = this.calcMOE(respondents / this.sampleSize);
    });
    return { questionArray: questionArray, questionArrayMOE: questionArrayMOE };
  }

  getDemoPositions(sql) {
    var db = require("../../db");
    return new Promise((resolve, reject) => {
      db.query(sql, (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      });
    });
  }

  async pollRandomDemographic(demoPositions, demoId) {
    var socialShare;
    var economicShare;

    demoId = parseInt(demoId);

    while (socialShare == undefined && economicShare == undefined) {
      demoPositions.map((demo) => {
        demo = demo[0];
        if (demo.demoID == demoId && demo.type == "social") {
          socialShare = demo;
        }
        if (demo.demoID == demoId && demo.type == "economic") {
          economicShare = demo;
        }
      });
    }
    var se = {
      social: this.grabWeightedRandomPosition(socialShare),
      economic: this.grabWeightedRandomPosition(economicShare),
    };
    return se;
  }
  async approvalPoll() {
    var sumApproval = 0;
    var pollingDemographics = [];
    var sampleArray = [];

    var sql = "";

    for (let i = 0; i < this.sampleSize; i++) {
      var demographicArrayPopShare = await Demographic.demographicArrayPopShare(this.demoArray);
      pollingDemographics.push(this.grabWeightedRandomDemo(demographicArrayPopShare));
    }
    pollingDemographics.map(async (randomDemographic) => {
      sql += "SELECT `type`,`demoID`,`-5`,`-4`,`-3`,`-2`,`-1`,`0`,`1`,`2`,`3`,`4`,`5` FROM demoPositions WHERE demoID=" + `${randomDemographic.id} AND type='${"social"}';`;
      sql += "SELECT `type`,`demoID`,`-5`,`-4`,`-3`,`-2`,`-1`,`0`,`1`,`2`,`3`,`4`,`5` FROM demoPositions WHERE demoID=" + `${randomDemographic.id} AND type='${"economic"}';`;
    });
    var demoPositionResults = await this.getDemoPositions(sql);
    await Promise.all(
      pollingDemographics.map(async (randomDemographic) => {
        var se = await this.pollRandomDemographic(demoPositionResults, randomDemographic.id);
        let approval = await DemographicSupport.getTotalApproval(se, this.user.userInfo);
        sumApproval += approval;
        sampleArray.push(approval);
      })
    );
    this.mean = sumApproval / this.sampleSize;

    const { questionArray, questionArrayMOE } = this.populateQuestionArray(sampleArray);
    this.questionArray = questionArray;
    this.questionArrayMOE = questionArrayMOE;
    this.updateStandardDeviation();
    this.updateMarginOfError();

    return {
      zScore: this.z_score(this.confidenceLevel).toFixed(3),
      sampleSize: this.sampleSize,
      confidence: this.confidenceLevel,
      mean: this.mean,
      questionArray: this.questionArray,
      questionArrayMOE: this.questionArrayMOE,
      standardDeviation: Math.round(this.standardDeviation),
      marginOfError: this.marginOfError,
      demoArray: this.demoArray,
    };
  }
}
module.exports = Poll;
