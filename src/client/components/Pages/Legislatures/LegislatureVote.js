import React, { useContext, useState, useEffect } from "react";
import { useParams, withRouter } from "react-router";
import { ClipLoader } from "react-spinners";
import LegislatureService from "../../../service/LegislatureService";
import { AlertContext } from "../../../context/AlertContext";
import Body from "../../Structure/Body";

function LegislatureVote(props) {
  const [loading, setLoading] = useState(true);
  const [vote, setVoteInfo] = useState({});
  const { voteId } = useParams();
  const { setAlert } = useContext(AlertContext);

  useEffect(() => {
    async function fetchVote() {
      var resp = await LegislatureService.fetchVote(voteId);
      if (!resp.hasOwnProperty("error")) {
        setVoteInfo(resp);
        setLoading(false);
      } else {
        setAlert("Vote not found.");
        props.history.push("/");
      }
      return () => setLoading(true);
    }
    fetchVote();
  }, [voteId]);

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
        <h1>{vote.name}</h1>
      </Body>
    );
  }
}

export default withRouter(React.memo(LegislatureVote));
