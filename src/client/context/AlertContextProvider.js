import React, { useState } from "react";
import { AlertContext } from "./AlertContext";

export default function AlertContextProvider(props) {
  const [alert, setAlert] = useState(null);
  const [alertType, setAlertType] = useState("");

  return <AlertContext.Provider value={{ alert, setAlert, alertType, setAlertType }}>{props.children}</AlertContext.Provider>;
}
