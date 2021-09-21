import React, { useState, useContext } from "react";
import PartyInfoService from "../../../../service/PartyService";
import { AlertContext } from "../../../../context/AlertContext";

export default function ChangePartyPicture() {
  const [selectedFile, setSelectedFile] = useState();
  const { setAlert, setAlertType } = useContext(AlertContext);

  const onImageChange = function (e) {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  async function onImageUpload() {
    var info = await PartyInfoService.updatePartyPicture(selectedFile);
    if (info && !info.hasOwnProperty("error")) {
      setAlert("Successfully uploaded image. (refresh to see changes)");
      setAlertType("success");
    } else {
      setAlert(info.error);
    }
  }

  return (
    <tr>
      <td>Change Party Picture</td>
      <td>
        <input className="form-control" type="file" onChange={onImageChange} />
        <p
          style={{
            textAlign: "left",
            marginBottom: "1px",
            marginLeft: "2px",
          }}
        >
          Accepted File Types: .png, .jpeg, .gif, .bmp
        </p>
      </td>
      <td>
        <button className="btn btn-primary" onClick={onImageUpload}>
          Change Picture
        </button>
      </td>
    </tr>
  );
}
