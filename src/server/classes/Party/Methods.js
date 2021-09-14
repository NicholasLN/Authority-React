var each = require("foreach");

/**
 * Checks if a user has specified permission.
 * @param {*} userId
 * @param {*} partyInfo
 * @param {*} permName
 * @returns
 */
function userHasPerm(userId, partyInfo, permName) {
  var partyRoles = parseRoles(partyInfo);
  var hasPerm = false;
  if (partyInfo) {
    each(partyRoles, function (role, roleTitle) {
      let roleOccupant = role.occupant;
      each(role.perms, function (value, permTitle) {
        if (roleOccupant == userId) {
          if (permTitle == "leader" && value == 1) {
            hasPerm = true;
          } else {
            if (permTitle == permName && value == 1) {
              hasPerm = true;
            }
          }
        }
      });
    });
  }
  return hasPerm;
}
/**
 *  Returns information about leader (title/id)
 * @param {*} partyInfo
 * @param {*} nameOrID
 * @returns
 */
function getLeaderInfo(partyInfo, nameOrID) {
  var roles = parseRoles(partyInfo);

  var returnVariable = "";
  if (partyInfo) {
    each(roles, function (role, roleTitle) {
      each(role.perms, function (value, key) {
        if (key == "leader" && value == 1) {
          if (nameOrID == "title") {
            returnVariable = roleTitle;
          }
          if (nameOrID == "id") {
            returnVariable = role.occupant;
          }
          if (nameOrID == "uniqueID") {
            returnVariable = role.uniqueID;
          }
        }
      });
    });
  }
  return returnVariable;
}
/**
 * Generates a role list
 * @param {*} partyInfo
 * @param {*} includeLeader
 * @returns
 */
function generateRoleList(partyInfo, includeLeader = false) {
  var partyRoleJSON = [];
  if (partyInfo) {
    each(JSON.parse(partyInfo.partyRoles), function (role, roleTitle) {
      var roleJSON = {
        roleName: roleTitle,
        roleOccupant: role.occupant,
        rolePermissions: [],
        isLeader: 0,
      };
      each(role.perms, function (permissionValue, permission) {
        if (permissionValue == 1) {
          if (permission == "leader") {
            roleJSON.isLeader = 1;
          }
          roleJSON.rolePermissions.push(permission);
        }
      });
      if (roleJSON.isLeader) {
        if (includeLeader) {
          partyRoleJSON.push(roleJSON);
        }
      } else {
        partyRoleJSON.push(roleJSON);
      }
    });
  }
  return partyRoleJSON;
}

function parseRoles(partyInfo) {
  try {
    var roles = JSON.parse(partyInfo.partyRoles);
  } catch (SyntaxError) {
    var roles = partyInfo.partyRoles;
  }
  return roles;
}

/**
 * Returns the role title of a user in a party.
 * @param {Object} partyInfo
 * @param {Int} userId
 * @param {string} [type=name] Type of variable returned. Default is 'name', so the name of the role.
 * @returns
 * **Returns -1 if user holds no role
 */
function getUserRole(partyInfo, userId, type = "name") {
  var returnVar = "Member";
  if (type != "name") {
    returnVar = -1;
  }
  var roles = parseRoles(partyInfo);
  each(roles, function (role, roleTitle) {
    if (role.occupant == userId) {
      switch (type) {
        case "name":
          returnVar = roleTitle;
          break;
        case "uniqueID":
          returnVar = role.uniqueID;
          break;
      }
    }
  });
  return returnVar;
}

/**
 * Changes the occupant of a role
 *  ex. changeOccupant(partyInfo, getLeaderInfo(partyInfo, "uniqueID"), 1) returns new role information with chairman replaced.
 * @param {Object} partyInfo Party information.
 * @param {Int} uniqueRoleID The unique ID of the role trying to be changed
 * @param {Int} newOccupant The Politician ID of the new occupant.
 * @returns New party information array to update the database with.
 */
function changeOccupant(partyInfo, uniqueRoleID, newOccupant) {
  var roles = parseRoles(partyInfo);
  each(roles, function (role, roleTitle) {
    if (role.uniqueID == uniqueRoleID) {
      role.occupant = newOccupant;
    }
  });
  return roles;
}

module.exports = {
  userHasPerm,
  getLeaderInfo,
  generateRoleList,
  getUserRole,
  changeOccupant,
};
