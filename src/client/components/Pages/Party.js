import React, { useState, useEffect, useContext } from "react";
import { useParams, withRouter } from "react-router";
import { AlertContext } from "../../context/AlertContext";
import PartyInfoService from "../../service/PartyService";
import Body from "../Structure/Body";
import ClipLoader from "react-spinners/ClipLoader";
import { UserContext } from "../../context/UserContext";
import PartyOverview from "./PartyModes/PartyOverview";
import PartyMembers from "./PartyModes/PartyMembers";
import { getLeaderInfo, getUserRole, userHasPerm } from "../../../server/classes/Party/Methods";
import PartyManagement from "./PartyModes/PartyManagement";

function Party(props) {
  var [partyID, setPartyID] = useState(null);
  var [partyInfo, setPartyInfo] = useState({});
  var [partyLoading, setLoading] = useState(true);
  var [partyMode, setPartyMode] = useState("overview");
  var { partyId: requestedPartyId, mode } = useParams();
  var { setPlayerData, setRefresh, refresh } = useContext(UserContext);
  const { setAlert } = useContext(AlertContext);
  const { sessionData, playerData } = useContext(UserContext);

  useEffect(() => {
    console.debug(requestedPartyId, mode);
    async function fetchData() {
      if (mode != "overview" && mode != "treasury" && mode != "management" && mode != "committee" && mode != "members") {
        setPartyMode("overview");
      } else {
        setPartyMode(mode);
      }
      // For some reason, they don't provide a party ID.
      if (requestedPartyId === undefined) {
        setAlert("Party ID not provided.");
        props.history.push("/");
      } else {
        setPartyID(requestedPartyId);
        var info = await PartyInfoService.fetchPartyById(requestedPartyId);
        console.log(info);
        // Fetching party returns error
        if (info.hasOwnProperty("error")) {
          setAlert("Party not found.");
          // Redirect to index. Because I'm lazy.
          props.history.push("/");
        } else {
          setPartyInfo(info);
        }
      }
      // Set loading to false to remove loading screen.
      setLoading(false);
      document.title = `${info.name} | AUTHORITY`;
    }
    fetchData();

    return function cleanup() {
      setLoading(true);
    };
  }, [requestedPartyId, mode, setPartyInfo]);

  const leaveParty = async () => {
    if (sessionData.loggedIn) {
      if (playerData.party == partyInfo.id) {
        var data = await PartyInfoService.leaveParty();
        const { userInfo, partyInfo } = data;
        setPlayerData(userInfo);
        setPartyInfo(partyInfo);
      }
    }
  };
  const joinParty = async () => {
    var id = partyInfo.id;
    if (sessionData.loggedIn) {
      var data = await PartyInfoService.joinParty(id);
      const { userInfo, partyInfo } = data;
      setPlayerData(userInfo);
      setPartyInfo(partyInfo);
      setRefresh(refresh + 1);
    }
  };
  const claimLeadership = async () => {
    if (sessionData.loggedIn && getLeaderInfo(partyInfo, "id") == 0) {
      var data = await PartyInfoService.claimLeadership();
      const { userInfo, partyInfo } = data;
      setPlayerData(userInfo);
      setPartyInfo(partyInfo);
      setRefresh(refresh + 1);
    }
  };
  const resignLeadership = async () => {
    if (sessionData.loggedIn && getUserRole(partyInfo, playerData.id, "uniqueID") != -1) {
      var data = await PartyInfoService.resignLeadership();
      const { userInfo, partyInfo } = data;
      setPlayerData(userInfo);
      setPartyInfo(partyInfo);
      setRefresh(refresh + 1);
    }
  };

  if (partyLoading) {
    return (
      <Body middleColWidth="11">
        <ClipLoader />
      </Body>
    );
  } else {
    return (
      <Body middleColWidth="11">
        <br />
        <h2>{partyInfo.name}</h2>

        <img style={{ maxWidth: "150px", maxHeight: "150px", border: "2.5px solid", borderColor: "black" }} src={partyInfo.partyPic} />
        <br />

        {/* If they are logged in and are in the same party. */}
        {sessionData.loggedIn && playerData.party == partyInfo.id && (
          <>
            <div style={{ marginTop: "8px" }} className="row justify-content-center">
              <div className="col-md-4">
                <button className="btn btn-danger" onClick={leaveParty}>
                  Leave Party (Lose 50% HSI)
                </button>
              </div>
            </div>
            {getLeaderInfo(partyInfo, "id") == 0 && (
              <div style={{ marginTop: "8px" }} className="row justify-content-center">
                <div className="col-md-4">
                  <button className="btn btn-primary" onClick={claimLeadership}>
                    Claim Leadership
                  </button>
                </div>
              </div>
            )}
            {getUserRole(partyInfo, playerData.id, "uniqueID") != -1 && (
              <div style={{ marginTop: "8px" }} className="row justify-content-center">
                <div className="col-md-4">
                  <button className="btn btn-primary" onClick={resignLeadership}>
                    Resign from Role
                  </button>
                </div>
              </div>
            )}
          </>
        )}
        {/* If they are logged in aren't in that party. */}
        {sessionData.loggedIn && playerData.party != partyInfo.id && (
          <>
            <div style={{ marginTop: "8px" }} className="row justify-content-center">
              <div className="col-md-4">
                <button className={playerData.party != partyInfo.id && playerData.party != 0 ? "btn btn-danger" : "btn btn-primary"} onClick={joinParty}>
                  {playerData.party != partyInfo.id && playerData.party != 0 ? "Defect to Party" : "Join Party"}
                </button>
              </div>
            </div>
          </>
        )}
        <hr />
        {/* Party Modes */}
        <div className="row justify-content-center">
          <div className="col">
            <button
              className={"btn btn-primary partyButton" + (partyMode == "members" ? " active" : "")}
              onClick={() => {
                setPartyMode("members");
              }}
            >
              Members
            </button>

            <button
              className={"btn btn-primary partyButton" + (partyMode == "overview" ? " active" : "")}
              onClick={() => {
                setPartyMode("overview");
              }}
            >
              Overview
            </button>

            <button
              className={"btn btn-primary partyButton" + (partyMode == "partyCommittee" ? " active" : "")}
              onClick={() => {
                setPartyMode("committee");
              }}
            >
              Party Committee
            </button>
            {userHasPerm(playerData.id, partyInfo, "leader") && (
              <button
                className={"btn btn-primary partyButton" + (partyMode == "partyManagement" ? " active" : "")}
                onClick={() => {
                  setPartyMode("management");
                }}
              >
                Party Management
              </button>
            )}
          </div>
        </div>
        <hr />

        {/*Roles*/}
        {partyMode == "overview" && <PartyOverview partyInfo={partyInfo} />}

        {partyMode == "members" && <PartyMembers partyInfo={partyInfo} />}

        {partyMode == "management" && <PartyManagement partyInfo={partyInfo} />}

        {partyMode == "committee" && props.history.push(`/partyCommittee/${partyInfo.id}`)}
      </Body>
    );
  }
}
export default withRouter(Party);
