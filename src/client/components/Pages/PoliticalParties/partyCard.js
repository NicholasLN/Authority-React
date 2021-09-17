import React, { useState, useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import PartyInfoService from "../../../service/PartyService";
import { BeatLoader } from "react-spinners";
import { selectColor, getPositionName } from "../../../../server/classes/Misc/Methods";
import ReactTooltip from "react-tooltip";
import "../../../css/profile.css";
import { Resizable } from "re-resizable";
import Editor from "rich-markdown-editor";
import editorTheme from "../../Misc/EditorTheme";

const resizableStyle = {
  margin: "auto",
  padding: "10px",
  backgroundColor: "rgba(240,240,240,0.77)",
};
const resizableEnable = {
  top: false,
  right: false,
  bottom: true,
  left: false,
  topRight: false,
  bottomRight: true,
  bottomLeft: true,
  topLeft: false,
};

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
              <Resizable className="bioContainer" style={resizableStyle} enable={resizableEnable}>
                <pre className="bioBox" style={{ maxHeight: "20vh" }}>
                  <Editor style={{ overflow: "disabled" }} readOnly={true} theme={editorTheme} defaultValue={party.partyBio} />
                </pre>
              </Resizable>
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
