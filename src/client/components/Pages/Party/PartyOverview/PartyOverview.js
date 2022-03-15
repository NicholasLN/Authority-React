import React, { useState, useEffect } from "react";
import { getLeaderInfo, generateRoleList } from "../../../../../server/classes/Misc/Methods";
import { LinkContainer } from "react-router-bootstrap";
import AuthorizationService from "../../../../service/AuthService";
import { SyncLoader } from "react-spinners";
import forEach from "async-foreach";
import ReactTooltip from "react-tooltip";
import PartyInfoService from "../../../../service/PartyService";
import { rolePermTooltip } from "../../../../../server/classes/Misc/Methods";
import PartyRoleCard from "./PartyRoleCard";

function PartyOverview({ partyInfo }) {
  let [partyRoles, setPartyRoles] = useState();
  let [loading, setLoading] = useState({});

  useEffect(() => {
    async function fetchData() {
      // Roles //
      var reqPartyRoles = await PartyInfoService.fetchRoleList(partyInfo.id);
      setPartyRoles(reqPartyRoles);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <>
        <SyncLoader size={10} />
      </>
    );
  }
  return (
    <>
      <h3>{partyInfo.leaderCosmetics.title}</h3>
      {partyInfo.leaderCosmetics != 0 && (
        <div className="mx-auto mb-0" style={{ maxWidth: "30%" }}>
          <LinkContainer to={`/politician/${partyInfo.leaderCosmetics.id}`}>
            <a>
              <img src={partyInfo.leaderCosmetics.picture} className="img-thumbnail mw-25" />
              <h5 className="mt-1">{"" + partyInfo.leaderCosmetics.name}</h5>
            </a>
          </LinkContainer>
        </div>
      )}
      <hr />
      <div className="row justify-content-center">
        {partyRoles.map((roleInfo, idx) => {
          return <PartyRoleCard roleInfo={roleInfo} key={idx} />;
        })}
      </div>
    </>
  );
}

export default React.memo(PartyOverview);
