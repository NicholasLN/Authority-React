import React, { useEffect, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { BeatLoader } from "react-spinners";
import AuthorizationService from "../../../service/AuthService";

export default function MemberCell(props) {
  return (
    <>
      <LinkContainer to={"/politician/" + props.userInfo.userID}>
        <a>
          <img style={{ maxWidth: "40px", maxHeight: "40px" }} src={props.userInfo.userPicture} />
          <p style={{ margin: 0 }}>{props.userInfo.userName}</p>
        </a>
      </LinkContainer>
    </>
  );
}
