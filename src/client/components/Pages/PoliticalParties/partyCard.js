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
  overflow: "auto",
  overflowX: "hidden",
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
  return (
    <div style={{ padding: "4px" }} className="col-md-4">
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
            <span>{party.leaderCosmetics.title}</span>
            <br />
            {party.leaderCosmetics.name != "Vacant" ? (
              <LinkContainer to={"/politician/" + party.leaderCosmetics.id}>
                <a>
                  <img className="leaderImg" src={party.leaderCosmetics.picture} />
                  <br />
                  <span>{party.leaderCosmetics.name}</span>
                </a>
              </LinkContainer>
            ) : (
              <>
                {" "}
                <img className="leaderImg" src={party.leaderCosmetics.picture} />
                <br />
                <span>Vacant</span>
              </>
            )}
            <hr />
            <Resizable className="bioContainer" style={resizableStyle} enable={resizableEnable}>
              <pre className="bioBox" style={{ maxHeight: "20vh" }}>
                <Editor readOnly={true} theme={editorTheme} defaultValue={party.partyBio} />
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
