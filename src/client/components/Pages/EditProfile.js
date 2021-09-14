import React, { useContext, useEffect, useState } from "react";
import { withRouter } from "react-router";
import Editor from "rich-markdown-editor";
import { AlertContext } from "../../context/AlertContext";
import { UserContext } from "../../context/UserContext";
import "../../css/profile.css";
import firebase from "../../firebase/firebase";
import AuthorizationService from "../../service/AuthService";
import light from "../Misc/EditorTheme";
import Body from "../Structure/Body";

function EditProfile(props) {
  const { sessionData, playerData, refresh, setRefresh } = useContext(UserContext);
  const { setAlert, setAlertType } = useContext(AlertContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [bioText, setBioText] = useState("");

  const onImageChange = function (e) {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  const onImageUpload = async function () {
    var url = await AuthorizationService.updateUserPicture(selectedFile);
    if (url && !url.hasOwnProperty("error")) {
      var resp = await AuthorizationService.updateUserPictureURL(url);
      if (resp == "OK") {
        setAlert("image successfully uploaded!");
        setAlertType("success");
      }
    } else {
      setAlertType("error");
      setAlert(url.error);
    }
  };

  const onBioSubmit = async function () {
    var response = await AuthorizationService.updateUserBio(bioText);
    if (response == "OK") {
      setAlert("Biography successfully changed!");
      setAlertType("success");
      setRefresh(refresh + 1);
    }
  };

  useEffect(() => {
    if (!sessionData.loggedIn) {
      props.history.push("/");
      setAlert("Not logged in.");
    }
  }, []);

  return (
    <Body middleColWidth="7">
      <br />
      <h2>Edit Profile</h2>
      <hr />

      <table className="table table-striped table-responsive">
        <thead className="dark">
          <tr>
            <th scope="col">Action</th>
            <th scope="col">Input</th>
            <th scope="col">Submit</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Change Profile Picture</td>
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
        </tbody>
      </table>
      <hr />
      <h4>Change Bio</h4>
      <hr />
      <div
        spellCheck="false"
        style={{
          overflow: "auto",
          margin: "15px",
          backgroundColor: "rgba(240,240,240,0.77)",
          textAlign: "left",
          minHeight: "30vh",
        }}
        className="bioContainer"
      >
        <Editor className="bioBox" theme={light} onChange={(value) => setBioText(value())} defaultValue={playerData.bio} />
      </div>
      <br />
      <button onClick={onBioSubmit} className="btn btn-primary">
        Change Biography
      </button>
    </Body>
  );
}

export default withRouter(EditProfile);
