import React, { useState, useContext, useEffect } from "react";
import Body from "../Structure/Body";
import AuthorizationService from "../../service/AuthService";
import { UserContext } from "../../context/UserContext";
import { AlertContext } from "../../context/AlertContext";
import { withRouter } from "react-router";

function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { sessionData, setSessionData, setPlayerData } = useContext(UserContext);
  const { setAlert, setAlertType } = useContext(AlertContext);

  useEffect(() => {
    if (sessionData.loggedIn) {
      setAlert("You're literally already logged in dude. What the fuck.");
      props.history.push("/politician/" + sessionData.loggedInId);
    }
  }, []);

  var login = async function () {
    var body = { username: username, password: password };
    var sessionData = await AuthorizationService.login(body);
    if (!sessionData.hasOwnProperty("error")) {
      var loggedInInfo = await AuthorizationService.getLoggedInData(true, false, true);
      if (!loggedInInfo.hasOwnProperty("error")) {
        setSessionData(sessionData);
        setPlayerData(loggedInInfo);
        props.history.push(`politician/${sessionData.loggedInId}`);
        setAlert("Successfully logged in.");
        setAlertType("success");
      } else {
        setAlert("Error fetching logged in information. Please DM a developer on the discord.");
      }
    } else {
      setAlert(sessionData.error);
    }
  };

  return (
    <Body middleColWidth="4">
      <br />
      <h2>Login</h2>
      <hr />
      <div className="tableForm">
        <form onSubmit={(e) => e.preventDefault()}>
          <table className="table table-striped table-responsive">
            <tbody>
              <tr>
                <td>
                  <b>Username</b>
                </td>
                <td>
                  <input
                    onInput={(e) => setUsername(e.target.value)}
                    type="text"
                    name="username"
                    className="form-control"
                    placeholder="Enter Username Here"
                    required=""
                    pattern="[^()/><\][\\\x22,;|]+"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <b>Password</b>
                </td>
                <td>
                  <input
                    onInput={(e) => setPassword(e.target.value)}
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Enter Password Here"
                    required=""
                    pattern="[^()/><\][\\\x22,;|]+"
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <label>
            <input className="btn btn-primary" type="submit" value="Login" name="signIn" onClick={login} />
          </label>
        </form>
      </div>
    </Body>
  );
}
export default withRouter(Login);
