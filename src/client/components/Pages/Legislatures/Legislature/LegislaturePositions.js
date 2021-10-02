import React from "react";

function LegislaturePositions({ legislatureInfo }) {
  return (
    <div className="legislature-positions-container mt-3">
      {Object.keys(legislatureInfo.positions).map((position) => {
        let currentPosition = legislatureInfo.positions[position];
        return <p>{currentPosition.officeName}</p>;
      })}
    </div>
  );
}

export default LegislaturePositions;
