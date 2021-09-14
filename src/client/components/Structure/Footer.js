import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import NumberFormat from "react-number-format";

export default function Footer(props) {
  const { playerData } = useContext(UserContext);

  return (
    <div className="footerInformation">
      <p>
        <b>AUTHORITY:</b> {playerData.authority} <b>|| </b>
        <b>CF: $</b>
        <span className="greenFont">
          <NumberFormat
            value={playerData.campaignFinance}
            displayType={"text"}
            thousandSeparator={true}
          />
        </span>
      </p>
    </div>
  );
}
