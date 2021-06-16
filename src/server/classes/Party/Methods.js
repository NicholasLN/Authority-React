function userHasPerm(userId, partyInfo, permName){
    const partyRoles = partyInfo.partyRoles;
    var hasPerm = false;
    if(partyInfo){
        Object.keys(partyRoles).forEach(function(key){
            var perms = partyRoles[key].perms
            Object.keys(perms).forEach(function(key){
                let permission = key;
                let value = perms[permission];
                if(permission == "leader" && value == 1){
                    hasPerm = true;
                }
                else{
                    if(permission == permName && value == 1){
                        hasPerm = true;
                    }
                }
            })
        })
    }
    return hasPerm;
}



module.exports = {
    userHasPerm
}