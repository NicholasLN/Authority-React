import React, { useState, useEffect } from "react";
import { getLeaderInfo, generateRoleList } from "../../../../server/classes/Party/Methods";
import { LinkContainer } from "react-router-bootstrap";
import AuthorizationService from "../../../service/AuthService";
import { SyncLoader } from "react-spinners";
import forEach from "async-foreach";
import ReactTooltip from "react-tooltip";
import PartyInfoService from "../../../service/PartyService";
import { rolePermTooltip } from "../../../../server/classes/Misc/Methods";

function areEqual(prevProps, nextProps) {
  if (nextProps == prevProps) {
    return true;
  } else {
    return false;
  }
}

function PartyOverview(props) {
  let [partyInfo, setPartyInfo] = useState(props.partyInfo);
  let [leader, setLeader] = useState({});
  let [partyRoles, setPartyRoles] = useState();
  let [loading, setLoading] = useState({});

  useEffect(() => {
    setPartyInfo(props.partyInfo);
    async function fetchData() {
      var leaderInformation = await PartyInfoService.fetchPartyLeader(partyInfo.id);
      setLeader(leaderInformation);
      // Roles //
      var reqPartyRoles = await PartyInfoService.fetchRoleList(partyInfo.id);
      setPartyRoles(reqPartyRoles);
      setLoading(false);
    }
    fetchData();
    return function cleanup() {
      setLoading(true);
    };
  }, [props.partyInfo]);

  if (loading) {
    return (
      <>
        <SyncLoader size={10} />
      </>
    );
  }

  return (
    <>
      <h3>{leader.title}</h3>
      {leader.id != 0 ? (
        <>
          <ReactTooltip id="leader" delayShow={500} effect="solid" place="left">
            <span>{rolePermTooltip("leader")}</span>
          </ReactTooltip>
          <LinkContainer to={"/politician/" + leader.id}>
            <a>
              <img data-tip data-for="leader" style={{ maxWidth: "120px", maxHeight: "120px", border: "4px ridge yellow" }} src={leader.picture} />
              <br />
              {leader.name}
            </a>
          </LinkContainer>
        </>
      ) : (
        <>
          <img style={{ maxWidth: "120px", maxHeight: "120px", border: "4px ridge yellow" }} src={leader.picture} />
          <br />
          Unoccupied
        </>
      )}
      <hr />
      <div className="row justify-content-center">
        {partyRoles &&
          partyRoles.map((role, i) => (
            <div key={Math.random()} className="col-sm-3" style={{ marginTop: "8px" }}>
              <span>{role.roleName}</span>
              <ReactTooltip key={Math.random()} id={`${i}`} delayShow={500} place="left">
                {role.rolePermissions.map((permission, index) => (
                  <>
                    <span key={Math.random()}>
                      {rolePermTooltip(permission)}
                      <br />
                    </span>
                  </>
                ))}
              </ReactTooltip>
              <br />
              {role.roleOccupant != 0 ? (
                <LinkContainer key={Math.random()} to={"/politician/" + role.roleOccupant}>
                  <a>
                    <img data-tip data-for={`${i}`} style={{ maxWidth: "80px", height: "75px", border: "5px ridge darkgrey" }} src={role.occupantPicture} />
                    <p>{role.occupantName}</p>
                  </a>
                </LinkContainer>
              ) : (
                <>
                  <img style={{ maxWidth: "80px", height: "75px", border: "5px ridge darkgrey" }} src={role.occupantPicture} />
                  <p>Unoccupied</p>
                </>
              )}
            </div>
          ))}
      </div>
    </>
  );
}

export default React.memo(PartyOverview);
