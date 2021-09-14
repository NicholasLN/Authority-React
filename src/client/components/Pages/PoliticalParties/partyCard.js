import React, { useState, useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import PartyInfoService from "../../../service/PartyService";
import { BeatLoader } from "react-spinners";
import { selectColor, getPositionName } from "../../../../server/classes/Misc/Methods";
import ReactTooltip from "react-tooltip";

export default function PartyCard({ party }) {
  const [loading, setLoading] = useState(true);
  const [leaderCosmetics, setLeaderCosmetics] = useState(null);

  useEffect(() => {
    async function fetchData() {
      var leaderInformation = await PartyInfoService.fetchPartyLeader(party.id);
      setLeaderCosmetics(leaderInformation);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <>
        <div style={{ padding: "4px" }} className="col-sm-4">
          <div className="card">
            <div className="partyInfo">
              <div className="partyImgContainer">
                <BeatLoader className="partyImgLogo" />
              </div>
              <div className="partyNameContainer"></div>
              <div className="card-body"></div>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <div style={{ padding: "4px" }} className="col-sm-4">
        <div className="card">
          <div className="partyInfo">
            <div className="partyImgContainer">
              <img className="partyImgLogo" src={party.partyPic} />
            </div>
            <div className="partyNameContainer">
              <LinkContainer to={"/party/" + party.id}>
                <a>{party.name}</a>
              </LinkContainer>
            </div>
            <div className="card-body">
              <br />
              <span>{leaderCosmetics.title}</span>
              <br />
              <LinkContainer to={"/politician/" + leaderCosmetics.id}>
                <a>
                  <img className="leaderImg" src={leaderCosmetics.picture} />
                  <br />
                  <span>{leaderCosmetics.name}</span>
                </a>
              </LinkContainer>
              <hr />
              <pre className="partyBioContainer">{party.partyBio}</pre>
              <hr />
              <span>
                <b>Members:{party.activeMembers}</b>
              </span>
              <hr />
              Social Ideology:
              <ReactTooltip id={`${party.id}SocTool`}>
                <span>
                  Base: {getPositionName("social", party.initialSocPos)} ({party.initialSocPos})
                </span>
              </ReactTooltip>
              <span data-tip data-for={`${party.id}SocTool`} style={{ fontWeight: "bold" }}>
                <span style={{ color: selectColor(["blue", "#101010", "red"], party.socPos) }}>
                  {" "}
                  {getPositionName("social", party.socPos)} ({party.socPos})
                </span>
              </span>
              <br />
              Economic Ideology:
              <ReactTooltip id={`${party.id}EcoTool`}>
                <span>
                  Base: {getPositionName("economic", party.initialEcoPos)} ({party.initialEcoPos})
                </span>
              </ReactTooltip>
              <span data-tip data-for={`${party.id}EcoTool`} style={{ fontWeight: "bold" }}>
                <span style={{ color: selectColor(["blue", "#101010", "red"], party.ecoPos) }}>
                  {" "}
                  {getPositionName("economic", party.ecoPos)} ({party.ecoPos})
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
