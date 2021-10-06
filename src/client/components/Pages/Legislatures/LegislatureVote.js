import React, { useContext, useState, useEffect } from "react";
import { useParams, withRouter } from "react-router";
import { ClipLoader } from "react-spinners";
import LegislatureService from "../../../service/LegislatureService";
import { AlertContext } from "../../../context/AlertContext";
import Body from "../../Structure/Body";
import ReactTooltip from "react-tooltip";
import timeago from "time-ago";
import { LinkContainer } from "react-router-bootstrap";
import { UserContext } from "./../../../context/UserContext";

function LegislatureVote(props) {
  const [loading, setLoading] = useState(true);
  const [voteInfo, setVoteInfo] = useState({});
  const { voteId } = useParams();
  const { setAlert, setAlertType } = useContext(AlertContext);
  const { sessionData, playerData } = useContext(UserContext);

  useEffect(() => {
    async function fetchVote() {
      var resp = await LegislatureService.fetchVote(voteId);
      if (!resp.hasOwnProperty("error")) {
        setVoteInfo(resp);
        console.log(resp);
        setLoading(false);
      } else {
        setAlert("Vote not found.");
        props.history.push("/");
      }
      return () => setLoading(true);
    }
    fetchVote();
  }, [voteId]);

  async function voteAye() {
    var newVoteInfo = await LegislatureService.voteAye(voteInfo.id);
    if (!newVoteInfo.hasOwnProperty("error")) {
      setVoteInfo(newVoteInfo);
      setAlert("Successfully voted.");
      setAlertType("success");
    } else {
      setAlert(newVoteInfo.error);
    }
  }
  async function voteNay() {
    var newVoteInfo = await LegislatureService.voteNay(voteInfo.id);
    if (!newVoteInfo.hasOwnProperty("error")) {
      setVoteInfo(newVoteInfo);
      setAlert("Successfully voted.");
      setAlertType("success");
    } else {
      setAlert(newVoteInfo.error);
    }
  }

  if (loading) {
    return (
      <Body>
        <br /> <ClipLoader />
      </Body>
    );
  } else {
    return (
      <Body>
        <br />
        <h4>{voteInfo.name}</h4>
        <h6 dangerouslySetInnerHTML={{ __html: voteInfo.actionString }} />
        {voteInfo.constitutional && (
          <b className="bold">
            This is a constitutional vote/amendment and requires 2/3 of <u data-tip="every voter!">all</u> voters to aye.
          </b>
        )}
        <hr />
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
        {voteInfo.passed == 1 && <span class="greenFont">This vote has passed through the legislature.</span>}
        {voteInfo.passed == 0 && <span class="redFont">This vote has failed to pass through the legislature.</span>}
        <hr />
        <div className="row">
          <div className="col" style={{ minHeight: "40vh", borderRight: "1px solid black" }}>
            <h5>Ayes</h5>
            {sessionData.loggedIn && voteInfo.canVote.includes(playerData.office) && voteInfo.passed == -1 && (
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
                      <a>{`${politician.office} ${politician.politicianName} [${politician.state}]: `}</a>
                    </LinkContainer>
                    {politician.votes} Votes
                  </b>
                </div>
              );
            })}
          </div>
          <div className="col" style={{ minHeight: "40vh", borderLeft: "1px solid black" }}>
            <h5>Nays</h5>
            {sessionData.loggedIn && voteInfo.canVote.includes(playerData.office) && voteInfo.passed == -1 && (
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
                      <a>{`${politician.office} ${politician.politicianName} [${politician.state}]: `}</a>
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
            <b className="bold">PASS PERCENTAGE: {voteInfo.constitutional == 0 ? <>51% of existing votes to pass</> : <>66% of all votes to pass</>}</b>
            <br />
            {voteInfo.constitutional == 1 &&
              (voteInfo.passPercentage >= 66 ? <span className="greenFont">{voteInfo.passPercentage}%</span> : <span className="redFont">{voteInfo.passPercentage}%</span>)}
            {voteInfo.constitutional == 0 &&
              (voteInfo.passPercentage >= 51 ? <span className="greenFont">{voteInfo.passPercentage}%</span> : <span className="redFont">{voteInfo.passPercentage}%</span>)}
          </div>
        </div>
        <ReactTooltip />
      </Body>
    );
  }
}

export default withRouter(React.memo(LegislatureVote));
