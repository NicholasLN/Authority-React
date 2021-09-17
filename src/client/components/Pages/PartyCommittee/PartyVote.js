import React, { useContext, useEffect, useState } from "react";
import { useParams, withRouter } from "react-router";
import { ClipLoader } from "react-spinners";
import Body from "../../Structure/Body";
import { AlertContext } from "../../../context/AlertContext";
import PartyInfoService from "../../../service/PartyService";
import { LinkContainer } from "react-router-bootstrap";
import { UserContext } from "../../../context/UserContext";
import { userHasPerm } from "../../../../server/classes/Party/Methods";
import timeago from "time-ago";
import ReactTooltip from "react-tooltip";

function PartyVote(props) {
  var [partyInfo, setPartyInfo] = useState();
  var [voteInfo, setVoteInfo] = useState();
  var [loading, setLoading] = useState(true);
  const { setAlert } = useContext(AlertContext);
  const { sessionData, playerData } = useContext(UserContext);

  var { voteId } = useParams();

  async function voteAye() {
    var newVoteInfo = await PartyInfoService.voteAye(voteInfo.id, partyInfo.id);
    if (!newVoteInfo.hasOwnProperty("error")) {
      setVoteInfo(newVoteInfo);
    } else {
      setAlert(newVoteInfo.error);
    }
  }
  async function voteNay() {
    var newVoteInfo = await PartyInfoService.voteNay(voteInfo.id, partyInfo.id);
    if (!newVoteInfo.hasOwnProperty("error")) {
      setVoteInfo(newVoteInfo);
    } else {
      setAlert(newVoteInfo.error);
    }
  }

  const fetchInfo = async (id) => {
    var partyVote = await PartyInfoService.getPartyVote(id);
    if (!partyVote.hasOwnProperty("error")) {
      setVoteInfo(partyVote);
      var partyInfo = await PartyInfoService.fetchPartyById(partyVote.party);
      setPartyInfo(partyInfo);
      setLoading(false);
    } else {
      props.history.push("/");
      setAlert("Could not find vote.");
    }
  };
  useEffect(() => {
    if (voteId == null || voteId == undefined) {
      props.history.push("/");
      setAlert("No vote ID provided.");
    } else {
      fetchInfo(voteId);
    }
  }, [voteId]);

  if (!loading) {
    return (
      <Body>
        <br />
        <LinkContainer to={`/party/${partyInfo.id}`}>
          <a>
            <img src={partyInfo.partyPic} style={{ maxWidth: "150px", maxHeight: "150px", border: "2.5px solid black" }} />
            <br />
            <h5>{partyInfo.name}</h5>
          </a>
        </LinkContainer>
        <button className="btn btn-danger mb-3" onClick={() => props.history.goBack()}>
          Back to Committee
        </button>
        <h3>Party Vote</h3>
        <hr />
        <h4>{voteInfo.name}</h4>
        <h6 dangerouslySetInnerHTML={{ __html: voteInfo.actionString }} />
        <hr />
        {sessionData.loggedIn && (
          <>
            {userHasPerm(sessionData.loggedInId, partyInfo, "delayVote") && playerData.party == partyInfo.id && voteInfo.passed == -1 && (
              <>
                <button className="btn btn-danger mb-2">Delay Vote (lose 1/6th of Party Influence!)</button>
                <br />
              </>
            )}
            {voteInfo.delay == 1 && voteInfo.passed == -1 && (
              <>
                <span class="redFont">Delayed! (+12 hours)</span>
                <br />
              </>
            )}
            {voteInfo.passed == -1 && (
              <span>
                Vote ends:{" "}
                <ReactTooltip id="timestamp" delayHide={250}>
                  {new Date(voteInfo.expiresAt).toLocaleDateString("en-US")}
                  <br />
                  {new Date(voteInfo.expiresAt).toLocaleTimeString("en-US")}
                </ReactTooltip>
                <b data-tip data-for="timestamp" className="bold">
                  {timeago.ago(voteInfo.expiresAt)}
                </b>
              </span>
            )}
            {voteInfo.passed == 1 && <span class="greenFont">This vote has passed through the party committee.</span>}
            {voteInfo.passed == 0 && <span class="redFont">This vote has failed to pass through the party committee.</span>}
          </>
        )}
        <hr />
        <div className="row">
          <div className="col" style={{ minHeight: "40vh", borderRight: "1px solid black" }}>
            <h5>Ayes</h5>
            {sessionData.loggedIn && playerData.party == partyInfo.id && voteInfo.passed == -1 && (
              <>
                <button className="btn btn-primary" onClick={voteAye}>
                  Vote Aye
                </button>
                <hr />
              </>
            )}
            {voteInfo.ayeVoters.map((politician, idx) => {
              return (
                <div key={idx} style={{ marginTop: "3px" }}>
                  <b className="bold">
                    <LinkContainer to={`/politician/${politician.id}`}>
                      <a>{politician.politicianName + ` [${politician.state}]: `}</a>
                    </LinkContainer>
                    {politician.votes} Votes
                  </b>
                </div>
              );
            })}
          </div>
          <div className="col" style={{ minHeight: "40vh", borderLeft: "1px solid black" }}>
            <h5>Nays</h5>
            {sessionData.loggedIn && playerData.party == partyInfo.id && voteInfo.passed == -1 && (
              <>
                <button className="btn btn-danger" onClick={voteNay}>
                  Vote Nay
                </button>
                <hr />
              </>
            )}
            {voteInfo.nayVoters.map((politician, idx) => {
              return (
                <div key={idx} style={{ marginTop: "3px" }}>
                  <b className="bold">
                    <LinkContainer to={`/politician/${politician.id}`}>
                      <a>{politician.politicianName + ` [${politician.state}]: `}</a>
                    </LinkContainer>
                    {politician.votes} Votes
                  </b>
                </div>
              );
            })}
          </div>
        </div>
        <div className="row" style={{ borderTop: "2px solid black" }}>
          <div className="col">
            <p className="mt-2">{voteInfo.sumAyes} Ayes</p>
          </div>
          <div className="col">
            <p className="mt-2">{voteInfo.sumNays} Nays</p>
          </div>
        </div>
        <div className="row" style={{ borderTop: "2px solid black" }}>
          <div className="col">
            <b className="bold">REGULAR PASS PERCENTAGE (51% of existing votes to pass)</b>
            <br />
            {voteInfo.autoPassPercentage < 51 ? <span className="redFont">{voteInfo.regularPassPercentage}%</span> : <span className="greenFont">{voteInfo.regularPassPercentage}%</span>}
          </div>
          <div className="col">
            <b className="bold">AUTO PASS PERCENTAGE (60% of all votes in party to pass)</b>
            <br />
            {voteInfo.autoPassPercentage < 60 ? <span className="redFont">{voteInfo.autoPassPercentage}%</span> : <span className="greenFont">{voteInfo.autoPassPercentage}%</span>}
          </div>
        </div>
        <br />
      </Body>
    );
  } else {
    return (
      <Body>
        <ClipLoader />
      </Body>
    );
  }
}
export default React.memo(withRouter(PartyVote));
