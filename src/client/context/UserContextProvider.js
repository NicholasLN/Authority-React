import React, { useContext, useEffect, useState } from "react";
import Loading from "../components/Misc/Loading";
import AuthorizationService from "../service/AuthService";
import { AlertContext } from "./AlertContext";
import { UserContext } from "./UserContext";
import WindowFocusHandler from "./WindowFocusHandler";

export default function ContextProvider(props) {
  const [sessionData, setSessionData] = useState({});
  const [playerData, setPlayerData] = useState({});
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  const [isFocused, setFocus] = useState(true);

  const { setAlert } = useContext(AlertContext);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isFocused) {
          const sessionDataX = await AuthorizationService.getSessionData();
          var setSessionDataTo = {};
          if (sessionDataX.loggedIn) {
            // If logged in information is attached to the session, set player data to it to prevent having to hit API twice.
            if (sessionDataX.hasOwnProperty("loggedInInfo")) {
              setPlayerData(sessionDataX.loggedInInfo);
            } else {
              setPlayerData(await AuthorizationService.getLoggedInData());
            }
            if (playerData.hasOwnProperty("error")) {
              // Error fetching player data, so lets invalidate the session.
              setPlayerData({});
              setAlert("There was an error fetching your account..please contact an administrator.");
              setSessionDataTo = await AuthorizationService.logout();
            } else {
              setSessionDataTo = sessionDataX;
            }
          } else {
            // If they are logged out but still somehow have player data, invalidate it.
            if (playerData != {}) {
              setPlayerData({});
            }
            setSessionDataTo = sessionDataX;
          }
          setSessionData(setSessionDataTo);

          // Set loading to false to remove loading screen.
          if (loading) {
            setLoading(false);
          }
        } else {
          console.debug("not focused. skipping check");
        }
      } catch (error) {
        console.log(error);
      }
    };
    // Fetch data first
    fetchData();
    // Then start an interval which happens every 10 seconds to refresh data.
    const id = setInterval(() => {
      fetchData();
    }, 10000);
    // Cleanup function.
    return () => {
      clearInterval(id);
    };
  }, [refresh, isFocused]);

  if (loading) {
    return (
      <>
        <Loading />
        <UserContext.Provider value={{ isFocused, setFocus }}>
          <WindowFocusHandler />
        </UserContext.Provider>
      </>
    );
  } else {
    return (
      <UserContext.Provider
        value={{
          sessionData,
          setSessionData,
          playerData,
          setPlayerData,
          refresh,
          setRefresh,
          isFocused,
          setFocus,
        }}
      >
        <WindowFocusHandler />
        {props.children}
      </UserContext.Provider>
    );
  }
}
