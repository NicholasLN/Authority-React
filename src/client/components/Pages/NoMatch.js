import React from "react";
import Body from "../Structure/Body";

export default function NoMatch(props) {
  return (
    <Body>
      <br />
      <h1>404 Error: Page Not Found</h1>
      <hr />
      <p>This page was not found.</p>
      <p>
        Please visit <a href="/">the main site</a> to view the available pages
      </p>
    </Body>
  );
}
