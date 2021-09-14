import React, { useState, useEffect } from "react";

import { Resizable } from "re-resizable";
import editorTheme from "../../Misc/EditorTheme";
import Editor from "rich-markdown-editor";

const resizableStlye = {
  overflow: "auto",
  overflowX: "hidden",
  margin: "auto",
  padding: "10px",
  backgroundColor: "rgba(240,240,240,0.77)",
};
const resizableEnable = {
  top: false,
  right: false,
  bottom: true,
  left: false,
  topRight: false,
  bottomRight: true,
  bottomLeft: true,
  topLeft: false,
};

export default function PoliticianBio(props) {
  var [userBio, setBio] = useState(props.bio);

  useEffect(() => {
    function updateBio() {
      setBio(props.bio);
    }

    updateBio();
  }, [props.bio]);

  return (
    <Resizable className="bioContainer" style={resizableStlye} maxHeight={"40vh"} enable={resizableEnable}>
      <pre className="bioBox">
        <Editor readOnly={true} theme={editorTheme} defaultValue={userBio} />
      </pre>
    </Resizable>
  );
}
