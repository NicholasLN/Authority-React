import React, { useContext, useEffect, useState } from "react";
import { withRouter } from "react-router";
import Editor from "rich-markdown-editor";
import { AlertContext } from "../../context/AlertContext";
import { UserContext } from "../../context/UserContext";
import "../../css/profile.css";
import AuthorizationService from "../../service/AuthService";
import light from "../Misc/EditorTheme";
import Body from "../Structure/Body";

function EditProfile(props) {
  const { sessionData, playerData, refresh, setRefresh } = useContext(UserContext);
  const { setAlert, setAlertType } = useContext(AlertContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [bioText, setBioText] = useState("");

  const [songURL, setSongURL] = useState("none");
  const [songName, setSongName] = useState("none");

  const onImageChange = function (e) {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const onSongChange = async function () {
    var resp = await AuthorizationService.updateUserSong(songURL, songName);
    if (!resp.hasOwnProperty("error")) {
      setAlert("Song successfully updated.");
      setAlertType("success");
    } else {
      setAlert(resp.error);
    }
  };

  const onImageUpload = async function () {
    var resp = await AuthorizationService.updateUserPicture(selectedFile);
    if (resp && !resp.hasOwnProperty("error")) {
      var resp = await AuthorizationService.updateUserPictureURL(resp.url);
      if (resp == "OK") {
        setAlert("image successfully uploaded!");
        setAlertType("success");
      }
    } else {
      setAlertType("error");
      setAlert(resp.error);
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
          <tr>
            <td>Change Profile Song</td>
            <td>
              <input className="form-control" type="input" placeholder="Song URL (youtube, soundcloud, etc...)" onChange={(e) => setSongURL(e.target.value)} />
              <input className="form-control" type="input" placeholder="Your own description/name for the song (50 chars max)" onChange={(e) => setSongName(e.target.value)} />
            </td>
            <td>
              <button className="btn btn-primary" onClick={onSongChange}>
                Change Song
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
