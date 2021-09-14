import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Routes from "./components/routes/routes.js";
import { AlertContext } from "./context/AlertContext";
import { useAlert } from "react-alert";

export default function App(props) {
  const { alert, setAlert, alertType, setAlertType } = useContext(AlertContext);

  const alertDialog = useAlert();

  /*
    Used for handling alerts.
  */
  useEffect(() => {
    if (alertType == "") {
      setAlertType("error");
    }
    if (alert != null) {
      alertDialog.show(alert);
      setAlert(null);
    }
    if (alertType != "error") {
      setAlertType("error");
    }
  }, [alert]);

  return (
    <Router>
      <Routes />
    </Router>
  );
}
