import React, { useContext, useState } from "react";
import Editor from "rich-markdown-editor";
import light from "../../../Misc/EditorTheme";
import "../../../../css/profile.css";
import PartyInfoService from "../../../../service/PartyService";
import { AlertContext } from "../../../../context/AlertContext";

export default function ChangePartyBio(props) {
  var [bioText, setBioText] = useState("");
  var { setAlert, setAlertType } = useContext(AlertContext);

  async function updateBio() {
    var newPartyInfo = await PartyInfoService.changePartyBio(props.partyInfo.id, bioText);
    if (!newPartyInfo.hasOwnProperty("error")) {
      setAlert("Successfully changed party biography.");
      setAlertType("success");
    } else {
      setAlert(newPartyInfo.error);
    }
  }

  return (
    <tr>
      <td>Change Party Bio</td>
      <td>
        <div
          spellCheck="false"
          style={{
            overflow: "auto",
            backgroundColor: "rgba(240,240,240,0.77)",
            textAlign: "left",
            minHeight: "20vh",
          }}
          className="bioContainer"
        >
          <Editor className="bioBox" theme={light} onChange={(value) => setBioText(value())} defaultValue={props.partyInfo.partyBio} />
        </div>
      </td>
      <td>
        <button className="btn btn-primary" onClick={updateBio}>
          Submit
        </button>
      </td>
    </tr>
  );
}
