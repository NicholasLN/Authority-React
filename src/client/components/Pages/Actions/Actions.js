import React, { useEffect, useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import { AlertContext } from "../../../context/AlertContext";
import { withRouter } from "react-router";
import Body from "../../Structure/Body";
import ChangePositions from "./ChangePositions";

function Actions(props) {
  const { sessionData } = useContext(UserContext);
  const { setAlert } = useContext(AlertContext);

  useEffect(() => {
    if (sessionData.loggedIn) {
    } else {
      setAlert("You're not logged in. Bugger off.");
      props.history.push("/");
    }
  });

  return (
    <Body>
      <br />
      <h2>Politician Actions</h2>
      <table className="table table-striped table-responsive">
        <thead className="dark">
          <tr>
            <th scope="col">Action</th>
            <th scope="col">Input</th>
            <th scope="col">Submit</th>
          </tr>
        </thead>
        <tbody>
          <ChangePositions />
        </tbody>
      </table>
    </Body>
  );
}

export default React.memo(withRouter(Actions));
