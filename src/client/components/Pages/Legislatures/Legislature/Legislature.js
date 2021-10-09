import React, { useContext, useEffect, useState } from "react";
import LegislaturePositions from "./LegislaturePositions";
import LegislatureVotes from "./LegislatureVotes";
import { UserContext } from "./../../../../context/UserContext";
import ProposeVote from "./ProposeVote";

function Legislature({ legislatureInfo }) {
  const [mode, setModes] = useState("votes");
  const { sessionData, playerData } = useContext(UserContext);

  const hasOffice = (office) => {
    var rtn = false;
    legislatureInfo.positions.map((position) => {
      if (position.id == office) {
        var abilities = eval(position.abilities);
        if (abilities.includes("proposeVote")) {
          rtn = true;
        }
      }
    });
    return rtn;
  };

  useEffect(() => {
    return () => setModes("votes");
  });

  return (
    <div className="legislature-container">
      <h3>{legislatureInfo.name}</h3>
      <div className="row">
        <div className="col">
          <button className="btn btn-primary btn-sm mx-1" onClick={() => setModes("votes")}>
            Votes
          </button>
          <button className="btn btn-primary btn-sm mx-1" onClick={() => setModes("positions")}>
            Positions
          </button>
          {sessionData.loggedIn && hasOffice(playerData.office) && (
            <button className="btn btn-primary btn-sm mx-1" onClick={() => setModes("proposeVote")}>
              Propose Vote
            </button>
          )}
        </div>
      </div>
      {mode == "positions" && <LegislaturePositions legislatureInfo={legislatureInfo} />}
      {mode == "votes" && <LegislatureVotes legislatureInfo={legislatureInfo} />}
      {mode == "proposeVote" && <ProposeVote legislatureInfo={legislatureInfo} />}
    </div>
  );
}

export default React.memo(Legislature);
