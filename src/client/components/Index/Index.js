import React, { useEffect, useContext } from "react";
import { Button, h1 } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import Body from "../Structure/Body";
import GameLogo from "../../css/images/AuthorityLogoV3.png";
import { UserContext } from "../../context/UserContext";
import DiscordInvite from "react-discord-invite";

export default function Index(props) {
  const { sessionData } = useContext(UserContext);

  useEffect(() => {
    document.title = "AUTHORITY | INDEX";
  });

  return (
    <Body>
      <br />
      <img src={GameLogo} style={{ width: "50vh" }} alt="AuthorityLogo" />
      <h1>Authority 3.0</h1>

      <p>
        Authority is a WIP political game in which users can register as a politician, run for offices, run countries, play a vital part in the economic system within their countries (and others), and
        seize power through a variety of methods--legal, or illegal.
      </p>

      <hr />

      {sessionData.loggedIn ? (
        <></>
      ) : (
        <>
          <LinkContainer to="/register">
            <Button size="lg" active>
              Register Now!
            </Button>
          </LinkContainer>

          <br />

          <br />
          <p>
            Already have an account? <Link to="/login">Login Here</Link>
          </p>
          <hr />
        </>
      )}
      <DiscordInvite guild="600212077461897216" />
    </Body>
  );
}
