const { randomInt } = require("d3-random");
const Demographic = require("../Demographics/Demographic");
const { demoSetPopulation } = require("../Demographics/Methods");
var user = require("../User");
class Poll {
  constructor(demoArray, confidenceLevel, sampleSize, loggedInUser) {
    this.demoArray = demoArray;
    this.sampleSize = sampleSize;
    confidenceLevel >= 100 ? (this.confidenceLevel = 99) : (this.confidenceLevel = confidenceLevel);
    confidenceLevel <= 0 ? (this.confidenceLevel = 0.5) : (this.confidenceLevel = confidenceLevel);
    this.confidenceLevel = Math.abs(confidenceLevel).toFixed(6);
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
  marginOfError(p) {
    if (!isFloat(p)) throw new Error("bad param type");
    var z;
    z = this.z_score(this.confidenceLevel);
    var pop;
    pop = demoSetPopulation(demoArray);
    var sampleSize;
    sampleSize = this.sampleSize;
    return (z * sqrt(p * (1 - p))) / sqrt(((pop - 1) * sampleSize) / (pop - sampleSize));
  }
  updateStandardDeviation() {
    this.standardDeviation = this.variance / this.sampleSize;
  }
  updateMarginOfError() {
    var p = this.mean / 100;
    this.marginOfError = parseFloat(this.marginOfError(p).toFixed(2)) * 100;
  }

  grabWeightedRandomPosition(positionShare){
    var rand = randomInt(0,100);
    var sum = 0;
    var selectedPosition = null;
    Object.keys(selectedPosition).map((position, key)=>{
      sum += selectedPosition[position];
      if(sum>=rand){
        selectedPosition = position;
        break;
      }
    })
    return selectedPosition;
  }

  async pollRandomDemographic(demographic){
    var socialShare = await Demographic.grabPoliticalShare(demographic.id, "social"); 
    var economicShare = await Demographic.grabPoliticalShare(demographic.id, "economic");
    
    return({
      social:grabWeightedRandomPosition(socialShare),
      economic:grabWeightedRandomPosition(economicShare)
    })
  }
}
module.exports = Poll;
