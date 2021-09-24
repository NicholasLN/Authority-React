const forEach = require("foreach");

class DemographicSupport {
  static log(value, base) {
    return Math.log(value) / Math.log(base);
  }

  static getPositionDifferenceApproval(positionValue, demographicValue) {
    var difference = Math.abs(positionValue - demographicValue);
    var y = parseInt((75 + this.log(difference + 1, 0.975)).toFixed(2));
    if (y > 75) {
      y = 100;
    }
    if (y < 0) {
      y = 0;
    }
    return y;
  }
  static async getTotalApproval(demoPositions, userInfo) {
    //console.log(demoPositions);
    let demoSocial = demoPositions.social;
    let demoEco = demoPositions.economic;

    let userSocial = userInfo.socPos;
    let userEco = userInfo.ecoPos;
    let userHSI = userInfo.hsi;
    var chance = Math.floor(Math.random() * 101);

    let positionApproval = (this.getPositionDifferenceApproval(userSocial, demoSocial) + this.getPositionDifferenceApproval(userEco, demoEco)) / 2;

    if (chance <= userHSI) {
      if (positionApproval >= 100) {
        positionApproval = 100;
      }
    } else {
      positionApproval = -1;
    }
    return positionApproval;
  }
}

module.exports = DemographicSupport;
