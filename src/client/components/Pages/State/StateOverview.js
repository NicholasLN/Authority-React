import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import StateInfoService from "./../../../service/StateService";
import { useContext } from "react";
import { AlertContext } from "./../../../context/AlertContext";
import { withRouter } from "react-router";
import Body from "../../Structure/Body";
import { ClipLoader } from "react-spinners";
import { LinkContainer } from "react-router-bootstrap";

function StateOverview(props) {
  const [stateInfo, setStateInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const { setAlert } = useContext(AlertContext);
  const { stateId } = useParams();

  async function getStateInfo() {
    var resp = await StateInfoService.fetchState(stateId);
    if (!resp.hasOwnProperty("error")) {
      setStateInfo(resp);
    } else {
      setAlert(resp.error);
      props.history.push("/");
    }
  }
  useEffect(() => {
    getStateInfo();
    setLoading(false);
  }, [stateId]);

  if (!loading) {
    return (
      <Body>
        <h4 style={{ paddingTop: "16px" }}>The State of </h4>
        <h1>
          <b>{stateInfo.name}</b>
        </h1>
        <img width="300" src={stateInfo.flag} className="img-thumbnail" alt={`State flag of ${stateInfo.name}`} />
        <hr />
        <LinkContainer to={`/demographics/${stateInfo.nation}/${stateInfo.abbreviation}`}>
          <button className="btn btn-primary">Demographics</button>
        </LinkContainer>
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
export default withRouter(StateOverview);
