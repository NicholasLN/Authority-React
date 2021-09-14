/**
 * Component used for creating main, transferrable outline for game.
 */

import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { Row, Col } from "react-bootstrap";
import "../../css/main.css";

export default function Body(props) {
  let middleColWidth = 8;
  if (props.middleColWidth) {
    middleColWidth = props.middleColWidth;
  }

  let { sessionData } = useContext(UserContext);
  let isLoggedIn = sessionData.loggedIn;

  return (
    <>
      <NavBar />
      <div className="main">
        <div className="gameContainer">
          <Row>
            <Col sm />
            <Col sm={middleColWidth}>{props.children}</Col>
            <Col sm />
          </Row>
        </div>
        <div className="footerBar">
          <p>
            Developed by Phil Scott
            <br />
            This is a WIP game.
          </p>
        </div>
      </div>
      {isLoggedIn ? <Footer /> : <></>}
    </>
  );
}
