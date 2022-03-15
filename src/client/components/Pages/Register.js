import React, { useState, useEffect, useContext } from "react";
import Body from "../Structure/Body";
import Select from "react-select";
import { EconomicPositionDropdown, SocialPositionDropdown } from "../Misc/positionDropdown";
import StateInfoService from "../../service/StateService";
import { withRouter } from "react-router";
import AuthorizationService from "../../service/AuthService";
import { UserContext } from "../../context/UserContext";
import { AlertContext } from "../../context/AlertContext";

function Register(props) {
  // SET SESSION DATA
  var { setSessionData, setPlayerData, sessionData } = useContext(UserContext);
  var { setAlert } = useContext(AlertContext);

  // FORM DATA
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [email, setEmail] = useState(null);
  const [politicianName, setPoliticianName] = useState(null);
  const [selectedState, setSelectedState] = useState("California");
  const [selectedEcoPosition, setSelectedEcoPosition] = useState(0);
  const [selectedSocPosition, setSelectedSocPosition] = useState(0);

  // Find active states
  const [activeStates, setActiveStates] = useState([]);
  useEffect(() => {
    if (sessionData.loggedIn) {
      props.history.push("/politician/" + sessionData.loggedInId);
      setAlert("No. Fuck off.");
    } else {
      async function fetchData() {
        const options = [];
        let activeStatesAPI = await StateInfoService.activeStates();
        Object.keys(activeStatesAPI).forEach(function (k) {
          let stateName = activeStatesAPI[k].name;
          var obj = { value: stateName, label: stateName };
          options.push(obj);
        });
        setActiveStates(options);
      }
      fetchData();
    }
    return () => {};
  }, []);

  // Register function
  var register = async function () {
    if (username != null && password != null && politicianName != null) {
      var country = await StateInfoService.getStateOwner(selectedState);
      var body = {
        username: username,
        password: password,
        email: email,
        politicianName: politicianName,
        state: selectedState,
        country: country,
        ecoPos: selectedEcoPosition,
        socPos: selectedSocPosition,
      };
      var sessionData = await AuthorizationService.register(body);
      if (!sessionData.hasOwnProperty("error")) {
        setSessionData(sessionData);
        let newPlayerData = await AuthorizationService.getLoggedInData();
        setPlayerData(newPlayerData);
        props.history.push("/politician/" + sessionData.loggedInId);
      } else {
        setAlert(sessionData.error);
      }
    }
  };
  var changeState = function (e) {
    setSelectedState(e.value);
  };

  return (
    <>
      <Body middleColWidth="6">
        <br />
        <h1>Register Now!</h1>
        <h6>
          Please do not put any revealing information or important passwords here.
          <br />
          While I try, I can not guarantee absolute safety. Passwords are hashed in the database, so that I can't even see them.
        </h6>

        <div>
          <br />
          <h3>Login Information</h3>
          <h6>You will login with this information.</h6>
        </div>

        <form className="tableForm" onSubmit={(e) => e.preventDefault()}>
          <table className="table table-striped table-responsive">
            <tbody>
              <tr>
                <td>
                  <b>Username</b>
                </td>
                <td>
                  <input
                    onChange={(e) => setUsername(e.target.value)}
                    type="text"
                    name="username"
                    className="form-control"
                    placeholder="Enter Username Here"
                    required
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
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Enter Password Here"
                    required
                    pattern="[^()/><\][\\\x22,;|]+"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <b>Email Address</b>
                </td>
                <td>
                  <input onChange={(e) => setEmail(e.target.value)} type="email" name="email" className="form-control" placeholder="Email Address" required />
                </td>
              </tr>
            </tbody>
          </table>
          <br />
          <h3>Politician Information</h3>
          <h6>
            This will serve as your ingame information (what others will see), <b>so don't make it anything personal!</b>
          </h6>
          <hr />
          <table className="table table-striped table-responsive">
            <tbody>
              <tr>
                <td>Politician Name</td>
                <td>
                  <input onChange={(e) => setPoliticianName(e.target.value)} type="text" name="politicianName" className="form-control" placeholder="Enter Name Here" required />
                </td>
              </tr>
              <tr>
                <td>State</td>
                <td>
                  <Select options={activeStates} onChange={changeState} />
                </td>
              </tr>
              <tr>
                <td>Economic Positions</td>
                <td>
                  <select defaultValue={selectedEcoPosition} onChange={(e) => setSelectedEcoPosition(e.target.value)} className="form-control">
                    <EconomicPositionDropdown />
                  </select>
                </td>
              </tr>
              <tr>
                <td>Social Positions</td>
                <td>
                  <select defaultValue={selectedSocPosition} onChange={(e) => setSelectedSocPosition(e.target.value)} className="form-control">
                    <SocialPositionDropdown />
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
          <input className="btn btn-primary" type="submit" value="Register" onClick={register} />
        </form>
      </Body>
    </>
  );
}
export default withRouter(Register);
