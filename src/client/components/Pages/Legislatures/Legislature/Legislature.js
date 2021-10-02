import React, { useState } from "react";
import LegislaturePositions from "./LegislaturePositions";
import LegislatureVotes from "./LegislatureVotes";

function Legislature({ legislatureInfo }) {
  const [mode, setModes] = useState("votes");

  return (
    <div className="legislature-container">
      <h3>{legislatureInfo.name}</h3>
      <div className="row">
        <div className="col">
          <div className="btn btn-primary btn-sm mx-1" onClick={() => setModes("votes")}>
            Votes
          </div>
          <div className="btn btn-primary btn-sm mx-1" onClick={() => setModes("positions")}>
            Positions
          </div>
        </div>
      </div>
      {mode == "positions" && <LegislaturePositions legislatureInfo={legislatureInfo} />}
      {mode == "votes" && <LegislatureVotes legislatureInfo={legislatureInfo} />}
    </div>
  );
}

export default Legislature;
