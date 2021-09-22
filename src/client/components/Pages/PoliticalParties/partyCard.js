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
  backgroundColor: "white",
  maxWidth: "20vw",
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
    <div className="col-lg-4 mt-3">
      <div className="partyCard" style={{ borderColor: party.dominantColor }}>
        <LinkContainer to={`/party/${party.id}`}>
          <a>
            <img className="partyImgLogo" src={party.partyPic} />
            <h4 className="partyName">{party.name}</h4>
          </a>
        </LinkContainer>
        <span className="mt-3 mb-2">
          {party.partyBio.length > 0 && (
            <>
              <ReactTooltip id={`${party.id}.bio`} backgroundColor="white" className="extraClass" place="right" delayShow={1000} delayHide={1000} effect="float">
                <div className="editorTheme">
                  <Editor readOnly={true} theme={editorTheme} defaultValue={party.partyBio} />
                </div>
              </ReactTooltip>
              <a data-tip data-for={`${party.id}.bio`}>
                Hover for Bio
              </a>
              <br />
            </>
          )}
          <small>Members: {party.activeMembers}</small>
        </span>
        <small>
          Social Ideology:
          <ReactTooltip id={`${party.id}SocTool`}>
            <span>
              Base: {getPositionName("social", party.initialSocPos)} ({party.initialSocPos})
            </span>
          </ReactTooltip>
          <span data-tip data-for={`${party.id}SocTool`} style={{ fontWeight: "bold" }}>
            <span style={{ color: selectColor(["blue", "#101010", "red"], party.socPos) }}>
              {" " + getPositionName("social", party.socPos)} ({party.socPos})
            </span>
          </span>
        </small>
        <small>
          Economic Ideology:
          <ReactTooltip id={`${party.id}EcoTool`}>
            <span>
              Base: {getPositionName("economic", party.initialEcoPos)} ({party.initialEcoPos})
            </span>
          </ReactTooltip>
          <span data-tip data-for={`${party.id}EcoTool`} style={{ fontWeight: "bold" }}>
            <span style={{ color: selectColor(["blue", "#101010", "red"], party.ecoPos) }}>
              {" " + getPositionName("economic", party.ecoPos)} ({party.ecoPos})
            </span>
          </span>
        </small>
      </div>
    </div>
  );
}
