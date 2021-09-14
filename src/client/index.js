import React, { Provider } from "react";
import ReactDOM from "react-dom";
import App from "./App";

import UserContextProvider from "./context/UserContextProvider";

import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "./components/Structure/AlertTemplate";
import AlertContextProvider from "./context/AlertContextProvider";

const options = {
  // you can also just use 'bottom center'
  position: positions.TOP_RIGHT,
  timeout: 5000,
  offset: "10px",
  // you can also just use 'scale'
  transition: transitions.FADE,
};

ReactDOM.render(
  <AlertContextProvider>
    <AlertProvider template={AlertTemplate} {...options}>
      <UserContextProvider>
        <App />
      </UserContextProvider>
    </AlertProvider>
  </AlertContextProvider>,
  document.getElementById("root")
);
