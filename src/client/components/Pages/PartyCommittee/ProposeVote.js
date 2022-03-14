import React, { useState, useEffect, useContext } from "react";
import { useForm, Controller, get } from "react-hook-form";
import PartyMemberSearch from "../../Misc/PartyMemberSearch";
import RolePermissionRadio from "../../Misc/RolePermissionRadio";
import { getLeaderInfo, userHasPerm } from "../../../../server/classes/Party/Methods";
import PartyInfoService from "../../../service/PartyService";
import { withRouter } from "react-router";
import { AlertContext } from "../../../context/AlertContext";
import { UserContext } from "../../../context/UserContext";

function ProposeVote(props) {
  var [voteType, setVoteType] = useState("newChair");
  var { setAlert, setAlertType } = useContext(AlertContext);
  var { sessionData, playerData } = useContext(UserContext);

  const { control, reset, getValues, setValue, register, handleSubmit } = useForm();

  async function onSubmit(data) {
    data.partyId = props.partyInfo.id;
    var resp = await PartyInfoService.createPartyVote(data);
    //var resp = await PartyInfoService.createPartyVote(data);
    if (resp.hasOwnProperty("success")) {
      props.history.push(`/partyVote/${resp.success}`);
      setAlert("Vote successfully created!");
      setAlertType("success");
    } else {
      setAlert("Something went wrong. Idk bro.");
    }
  }

  function changeVoteType(e) {
    setVoteType(e.target.value);
    reset({ voteType: e.target.value, voteName: getValues("voteName") });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <table className="table table-striped">
        <thead className="dark">
          <tr>
            <th style={{ width: "15%" }}>Field</th>
            <th>Input</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <b className="bold">Vote Name</b>
            </td>
            <td>
              <input {...register("voteName", { required: true })} className="form-control" type="input" placeholder="Vote Name" />
            </td>
          </tr>
          <tr>
            <td>
              <b className="bold">Party Vote Action(s)</b>
            </td>
            <td>
              <select {...register("voteType")} className="form-control" onChange={changeVoteType}>
                <option value="newChair">New Chair</option>
                <option value="renameRole">Rename Role</option>
                <option value="changePermissions">Change Role Permissions</option>
                <option value="deleteRole">Delete Role</option>
                <option value="changeOccupant">Change Role Occupant</option>
                <option value="changeFees">Change Party Fees</option>
                <option value="renameParty">Rename Party</option>
                <option value="changeVotes">Change # of Party Votes</option>
                {sessionData.loggedIn && userHasPerm(playerData.id, props.partyInfo, "purgeMembers") && (
                <option value="purgeMembers">Purge Member (costs 10% party influence)</option>
                )}
              
              </select>
              {voteType == "newChair" && (
                <>
                  <Controller rules={{ required: true }} name="newChair" control={control} defaultValue="" render={({ field }) => <PartyMemberSearch {...field} partyInfo={props.partyInfo} />} />
                </>
              )}
              {voteType == "renameRole" && (
                <>
                  <select {...register("roleToRename")} className="form-control">
                    {Object.keys(props.partyInfo.partyRoles).map((key, idx) => {
                      return (
                        <option key={idx} value={props.partyInfo.partyRoles[key].uniqueID}>
                          {key}
                        </option>
                      );
                    })}
                  </select>
                  <input type="input" {...register("renameTo")} className="form-control" placeholder="Rename to" />
                </>
              )}
              {voteType == "changePermissions" && (
                <>
                  <Controller
                    name="perms"
                    control={control}
                    render={({ field }) => (
                      <RolePermissionRadio
                        onChange={(e) => {
                          if (getValues(`perms.${e.target.value}`) && getValues(`perms.${e.target.value}`) == true) {
                            setValue(`perms.${e.target.value}`, false);
                          } else {
                            setValue(`perms.${e.target.value}`, true);
                          }
                        }}
                      />
                    )}
                  />
                  <select {...register("changePermissionsTarget")} className="form-control">
                    {Object.keys(props.partyInfo.partyRoles).map((key, idx) => {
                      if (getLeaderInfo(props.partyInfo, "uniqueID") != props.partyInfo.partyRoles[key].uniqueID) {
                        return (
                          <option key={idx} value={props.partyInfo.partyRoles[key].uniqueID}>
                            {key}
                          </option>
                        );
                      }
                    })}
                  </select>
                </>
              )}
              {voteType == "deleteRole" && (
                <select {...register("deleteRoleTarget")} className="form-control">
                  {Object.keys(props.partyInfo.partyRoles).map((key, idx) => {
                    if (getLeaderInfo(props.partyInfo, "uniqueID") != props.partyInfo.partyRoles[key].uniqueID) {
                      return (
                        <option key={idx} value={props.partyInfo.partyRoles[key].uniqueID}>
                          {key}
                        </option>
                      );
                    }
                  })}
                </select>
              )}
              {voteType == "changeOccupant" && (
                <>
                  <select {...register("changeOccupantTarget")} className="form-control">
                    {Object.keys(props.partyInfo.partyRoles).map((key, idx) => {
                      if (getLeaderInfo(props.partyInfo, "uniqueID") != props.partyInfo.partyRoles[key].uniqueID) {
                        return (
                          <option key={idx} value={props.partyInfo.partyRoles[key].uniqueID}>
                            {key}
                          </option>
                        );
                      }
                    })}
                  </select>
                  <Controller
                    rules={{ required: true }}
                    name="changeOccupantId"
                    control={control}
                    defaultValue=""
                    render={({ field }) => <PartyMemberSearch {...field} partyInfo={props.partyInfo}/>}
                  />
                </>
              )}
              {voteType == "changeFees" && (
                <>
                  <input className="form-control" type="number" max={100} {...register("newFees")} placeholder={props.partyInfo.fees + "%"} />
                </>
              )}
              {voteType == "renameParty" && (
                <>
                  <input className="form-control" type="input" {...register("renameTo")} placeholder={props.partyInfo.name} />
                </>
              )}
              {voteType == "changeVotes" && (
                <>
                  <input className="form-control" type="number" {...register("changeVotesTo")} placeholder={props.partyInfo.votes} />
                </>
              )}
              {voteType == "purgeMembers" && (
               <>
                  <Controller rules={{ required: true }} name="purgeMembers" control={control} defaultValue="" render={({ field }) => <PartyMemberSearch {...field} partyInfo={props.partyInfo} />} />
               </> 
              )}
            </td>
          </tr>
          <tr>
            <td>
              <b className="bold">Propose Vote</b>
            </td>
            <td>
              <input className="btn btn-primary" type="submit" value="Propose Vote" name="proposeVoteSubmit" />
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  );
}

export default React.memo(withRouter(ProposeVote));
