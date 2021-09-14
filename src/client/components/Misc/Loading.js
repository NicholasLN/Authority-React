import React from "react";
import BeatLoader from "react-spinners/BeatLoader";

export default function Loading(props) {
  var containerStyle = {
    height: "100vh",
    position: "relative",
    backgroundColor: "white",
  };
  var centerStyle = {
    width: "100vw",
    position: "absolute",
    top: "50%",
    msTransform: "translateY(-50%)",
    transform: "translateY(-50%)",
    textAlign: "center",
  };

  return (
    <div style={containerStyle}>
      <div style={centerStyle}>
        <h1>Authority do be loading tho.</h1>
        <br />
        <BeatLoader />
      </div>
    </div>
  );
}
