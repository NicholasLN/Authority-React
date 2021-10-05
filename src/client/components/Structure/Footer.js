import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import NumberFormat from "react-number-format";
import { withRouter } from "react-router";

function Footer(props) {
  const { playerData } = useContext(UserContext);

  return (
    <div className="footerInformation">
      <button
        onClick={() => {
          props.history.goBack();
        }}
        className="btn btn-primary btn-sm"
        style={{ float: "left", fontFamily: "Bahnschrift", borderRadius: 0 }}
      >
        Go back a page
      </button>
      <p>
        <b>AUTHORITY:</b> {playerData.authority} <b>|| </b>
        <b>CF: $</b>
        <span className="greenFont">
          <NumberFormat value={playerData.campaignFinance} displayType={"text"} thousandSeparator={true} />
        </span>
      </p>
    </div>
  );
}
export default withRouter(Footer);
