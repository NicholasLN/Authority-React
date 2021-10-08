import React from "react";

function LegislaturePositions({ legislatureInfo }) {
  return (
    <div className="legislature-positions-container mt-3">
      {Object.keys(legislatureInfo.positions).map((position) => {
        let currentPosition = legislatureInfo.positions[position];
        return <p key={currentPosition.id}>{currentPosition.officeName}</p>;
      })}
    </div>
  );
}

export default React.memo(LegislaturePositions);
