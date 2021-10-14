import React, { useContext, useEffect, useState } from "react";
import NumberFormat from "react-number-format";
import { withRouter } from "react-router";
import { LinkContainer } from "react-router-bootstrap";
import { useParams } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import ReactTooltip from "react-tooltip";
import { getPositionName, selectColor } from "../../../../server/classes/Misc/Methods";
import { timeAgoString } from "../../../../server/classes/User/Method";
import { AlertContext } from "../../../context/AlertContext";
import { UserContext } from "../../../context/UserContext";
import "../../../css/profile.css";
import AuthorizationService from "../../../service/AuthService";
import Body from "../../Structure/Body";
import PoliticalCompass from "./PoliticalCompass";
import PoliticianBio from "./PoliticianBio";
import ReactPlayer from "react-player";
import { ProgressBar } from "react-bootstrap";

function Politician(props) {
  var { sessionData } = useContext(UserContext);
  var [politicianInfo, setPoliticianInfo] = useState({});
  var [loggedInUserIsUser, setLoggedInUserIsUser] = useState(false);
  var [loading, setLoading] = useState(true);

  // Video Player
  var [playing, setPlaying] = useState(true);
  var [played, setPlayed] = useState(0);
  var [duration, setDuration] = useState(1);

  const switchPlaying = () => {
    if (playing) {
      setPlaying(false);
    } else {
      setPlaying(true);
    }
  };

  //

  var { userId } = useParams();
  var { setAlert } = useContext(AlertContext);
  useEffect(() => {
    async function fetchData() {
      var requestedUserInfo = {};
      var userExists = false;
      // If the URL has no politician ID
      if (props.noRequestId) {
        // If they're logged in, then just send them their own page.
        if (sessionData.loggedIn) {
          requestedUserInfo = await AuthorizationService.getUserData(sessionData.loggedInId, true, true);
          // User exists if requested data exists.
          userExists = !requestedUserInfo.hasOwnProperty("error");
        }
        // If they're not, don't worry. There's a check later on.
      } else {
        // If they requested a specific ID, then get that politician.     (true, true requests additional state/party info.)
        requestedUserInfo = await AuthorizationService.getUserData(userId, true, true);
        // User exists if requested data exists.
        userExists = !requestedUserInfo.hasOwnProperty("error");
      }
      // If user doesn't exist
      if (!userExists) {
        // If they are logged in, send them to their own page.
        if (sessionData.loggedIn) {
          props.history.push(`/politician`);
          setAlert("Politician not found.");
        }
        // If they aren't, then send them to the index and spit out an alert.
        else {
          props.history.push(`/`);
          setAlert("Politician not found.");
        }
      }
      // If they do, then update the state and title. Remove loading screen.
      else {
        setPoliticianInfo(requestedUserInfo);
        if (sessionData.loggedInId == requestedUserInfo.id) {
          setLoggedInUserIsUser(true);
        }
        setLoading(false);
        document.title = requestedUserInfo.politicianName + " | AUTHORITY";
      }
    }
    fetchData();
    return function cleanup() {
      setLoading(true);
    };
    // Update if ID changes, or if current user logs out.
  }, [props.match.params.userId, sessionData.loggedIn]);
  return (
    <Body middleColWidth="7">
      {!loading ? (
        <>
          <br />
          <h2>{politicianInfo.politicianName}</h2>
          <div className="mainProfileContainer">
            <img className="profilePicture" src={politicianInfo.profilePic} alt="Profile Picture" />

            {!loggedInUserIsUser ? <div className="lastOnline">{timeAgoString(politicianInfo.lastOnline)}</div> : <></>}
            {politicianInfo.songURL && (
              <>
                <hr />
                <ReactPlayer
                  style={{ display: "none" }}
                  url={politicianInfo.songURL}
                  playing={playing}
                  onProgress={(progress) => {
                    setPlayed(progress.playedSeconds);
                  }}
                  onDuration={(duration) => {
                    setDuration(duration);
                  }}
                />
                <span>{politicianInfo.songName}</span>
                <ProgressBar className="m-0 p-0" id="playBar" now={`${(played / duration) * 100}`} style={{ width: "100%" }} />
                <button id="playButton" className="btn btn-default btn-xs">
                  <span className={playing ? "fas fa-pause" : "fas fa-play"} onClick={switchPlaying}></span>
                </button>
              </>
            )}
            <hr />
            <h4>Biography and Details</h4>
            <PoliticianBio bio={politicianInfo.bio} />
            <hr />
          </div>
          <ReactTooltip id={"positions"} backgroundColor="white" className="extraClass" delayShow={1000} delayHide={1000} effect="float">
            <PoliticalCompass ecoPos={politicianInfo.ecoPos} socPos={politicianInfo.socPos} />
          </ReactTooltip>
          <table className="table table-striped table-bordered" id="statsTable">
            <tbody>
              {/* Authority */}
              <tr>
                <td>Authority</td>
                <td>{politicianInfo.authority}</td>
              </tr>

              {/* Campaign Funding */}
              <tr>
                <td>Campaign Funding</td>
                <td>
                  $
                  <span className="greenFont">
                    <NumberFormat thousandSeparator={true} displayType={"text"} value={politicianInfo.campaignFinance} />
                  </span>
                </td>
              </tr>

              {/* State Influence */}
              <tr>
                <td>State Influence</td>
                <td>{politicianInfo.hsi}%</td>
              </tr>
              {politicianInfo.party != 0 ? (
                <tr>
                  <td>Political Party</td>
                  <td>
                    <LinkContainer to={`/party/${politicianInfo.partyInfo.id}`}>
                      <a href="#">{politicianInfo.partyInfo.name}</a>
                    </LinkContainer>
                  </td>
                </tr>
              ) : (
                <></>
              )}
              <tr>
                <td>Region</td>
                <td>
                  <LinkContainer to={`/state/${politicianInfo.stateInfo.name}`}>
                    <a href="#">
                      <img className="profileStateFlag" src={politicianInfo.stateInfo.flag} />
                      {politicianInfo.stateInfo.name}
                    </a>
                  </LinkContainer>
                </td>
              </tr>

              <tr>
                <td>Economic Positions</td>
                <td>
                  <span
                    data-tip
                    data-for={"positions"}
                    dangerouslySetInnerHTML={{ __html: `${getPositionName("economic", politicianInfo.ecoPos)} (${politicianInfo.ecoPos})` }}
                    style={{
                      color: selectColor(["blue", "#101010", "red"], politicianInfo.ecoPos),
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>Social Positions</td>
                <td>
                  <span
                    data-tip
                    data-for={"positions"}
                    dangerouslySetInnerHTML={{ __html: `${getPositionName("social", politicianInfo.socPos)} (${politicianInfo.socPos})` }}
                    style={{
                      color: selectColor(["blue", "#101010", "red"], politicianInfo.socPos),
                    }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <br />
        </>
      ) : (
        <>
          <br />
          <ClipLoader />
        </>
      )}
    </Body>
  );
}

export default withRouter(Politician);
