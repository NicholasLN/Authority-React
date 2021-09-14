import React, { useContext, useEffect, useState } from "react";
import { AlertContext } from "../../context/AlertContext.js";
import "../../css/alert.css";

function AlertTemplate({ style, options, message, close }) {
  const { alertType } = useContext(AlertContext);

  var [alertTemplateType, setAlertTemplateType] = useState("");
  var [strong, setStrong] = useState(null);
  var [progressWidth, setProgressWidth] = useState(100);

  useEffect(() => {
    setTimeout(() => {
      setProgressWidth(0);
    }, 1);

    var variant;
    var strong;
    switch (alertType) {
      case "success":
        variant = "notice-success";
        strong = "Success";
        break;
      case "error":
        variant = "notice-danger";
        strong = "Error";
        break;
      case "info":
        variant = "notice-info";
        strong = "Info";
        break;
      case "warning":
        variant = "notice-warning";
        strong = "Warning";
        break;
      default:
        variant = "notice-danger";
        strong = "warning";
    }
    setAlertTemplateType(variant);
    setStrong(strong);
  }, []);

  return (
    <div className="alertContainer">
      <div className={`notice ${alertTemplateType}`}>
        <strong>{strong}</strong> | {message}
      </div>
      <div
        className={`${alertTemplateType.replace("notice", "progress")}`}
        style={{
          width: `${progressWidth}%`,
          height: "3px",
          transition: `width ${options.timeout / 1000}s`,
          transitionTimingFunction: "linear",
        }}
      ></div>
    </div>
  );
}

export default React.memo(AlertTemplate);
