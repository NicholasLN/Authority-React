import React, { useContext, useEffect, useState } from "react";
import { withRouter } from "react-router";
import { userHasPerm } from "../../../../server/classes/Party/Methods";
import { UserContext } from "../../../context/UserContext";
import { AlertContext } from "../../../context/AlertContext";
import CreateRoleForm from "./PartyManagement/createRoleForm";
import ChangePartyPicture from "./PartyManagement/changePartyPicture";
import ChangePartyBio from "./PartyManagement/changePartyBio";

function PartyManagement(props) {
  const { sessionData, playerData } = useContext(UserContext);
  const [partyInfo, setPartyInfo] = useState(props.partyInfo);
  const { setAlert } = useContext(AlertContext);

  function updatePartyInfo(newPartyInfo) {
    setPartyInfo(newPartyInfo);
  }

  useEffect(() => {
    if (sessionData.loggedIn) {
      if (userHasPerm(sessionData.loggedInId, partyInfo, "leader")) {
      } else {
        setAlert("You do not have permission to be here.");
        props.history.push(`/party/${partyInfo.id}/overview`);
      }
    } else {
      setAlert("Not logged in.");
      props.history.push(`/party/${partyInfo.id}/overview`);
    }
  }, [props.partyInfo, sessionData.loggedIn, partyInfo.partyPic]);

  return (
    <table className="table table-striped table-responsive">
      <thead className="dark">
        <tr>
          <th scope="col">Action</th>
          <th scope="col">Input</th>
          <th scope="col">Submit</th>
        </tr>
      </thead>
      <tbody>
        <CreateRoleForm partyInfo={partyInfo} updatePartyInfo={updatePartyInfo} />
        <ChangePartyPicture updatePartyInfo={updatePartyInfo} />
        <ChangePartyBio partyInfo={partyInfo} />
      </tbody>
    </table>
  );
}

export default React.memo(withRouter(PartyManagement));
