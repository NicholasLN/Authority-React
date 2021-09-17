import React, { useContext, useEffect, useState } from "react";
import { useParams, withRouter } from "react-router";
import Body from "../../Structure/Body";
import PartyInfoService from "./../../../service/PartyService";
import { AlertContext } from "./../../../context/AlertContext";
import { LinkContainer } from "react-router-bootstrap";
import { UserContext } from "./../../../context/UserContext";
import PartyVotes from "./PartyVotes";
import { DotLoader } from "react-spinners";
import ProposeVote from "./ProposeVote";

function PartyCommittee(props) {
  var { partyId } = useParams();
  const { setAlert } = useContext(AlertContext);
  const { sessionData, playerData } = useContext(UserContext);

  var [partyInfo, setPartyInfo] = useState({});
  var [mode, setMode] = useState("votes");
  var [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      var partyInfo = await PartyInfoService.fetchPartyById(partyId);
      if (!partyInfo.hasOwnProperty("error")) {
        setPartyInfo(partyInfo);
        setLoading(false);
      } else {
        setAlert("Invalid Party Committee ID/Not Found");
        props.history.push("/");
      }
    }
    fetchData();

    return () => {};
  }, [partyId]);

  if (!loading) {
    return (
      <Body middleColWidth="10">
        <br />
        <LinkContainer to={`/party/${partyId}`}>
          <a>
            <img style={{ maxWidth: "150px", maxHeight: "150px" }} src={partyInfo.partyPic} />
            <h5>{partyInfo.name}</h5>
          </a>
        </LinkContainer>
        <h3>Committee</h3>
        <hr />
        <div className="row justify-content-center">
          <div className="col">
            <button className="btn btn-danger partyButton" onClick={() => props.history.goBack()}>
              Back to Party Page
            </button>
            <button className={`btn btn-primary partyButton ${mode == "votes" && "active"}`} onClick={() => setMode("votes")}>
              Active Votes
            </button>
            {sessionData.loggedIn && playerData.party == partyId && (
              <button className={`btn btn-primary partyButton ${mode == "proposeVote" && "active"}`} onClick={() => setMode("proposeVote")}>
                Propose Vote
              </button>
            )}
          </div>
        </div>
        <hr />
        {mode == "votes" && <PartyVotes partyInfo={partyInfo} />}
        {mode == "proposeVote" && <ProposeVote partyInfo={partyInfo} />}
      </Body>
    );
  } else {
    return (
      <Body>
        <DotLoader />
      </Body>
    );
  }
}

export default withRouter(PartyCommittee);
