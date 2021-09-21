import React, { useContext, useEffect, useState } from "react";
import { useParams, withRouter } from "react-router";
import PartyInfoService from "../../service/PartyService";
import Body from "../Structure/Body";
import { AlertContext } from "../../context/AlertContext";
import "../../css/politicalparties.css";
import { LinkContainer } from "react-router-bootstrap";
import PartyCard from "./PoliticalParties/partyCard";
import { UserContext } from "../../context/UserContext";
import { ClipLoader } from "react-spinners";

function PoliticalParties(props) {
  var { country } = useParams();
  var [parties, setParties] = useState([]);
  var { setAlert, setAlertType } = useContext(AlertContext);
  var { sessionData, playerData } = useContext(UserContext);
  var [mode, setMode] = useState("active");
  var [loading, setLoading] = useState(true);
  var [page, setPage] = useState(0);
  var [partyQuery, setPartyQuery] = useState(" ");

  const switchMode = () => {
    if (mode == "active") {
      setMode("defunct");
      setLoading(true);
    }
    if (mode == "defunct") {
      setMode("active");
      setLoading(true);
    }
  };
  async function fetchData() {
    var fetchedParties = await PartyInfoService.fetchParties(country, mode, page, partyQuery);
    if (!fetchedParties.hasOwnProperty("error")) {
      setParties(fetchedParties);
      setLoading(false);
    } else {
      setAlert(fetchedParties.error);
    }
  }
  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [country, mode, page]);

  if (!loading) {
    return (
      <Body middleColWidth="11">
        <br />
        <h2>Political Parties</h2>
        {mode == "active" && (
          <>
            <span>Parties that are currently operating (more than 0 active members)</span>
            <br />
            <button className="btn btn-danger" onClick={switchMode}>
              Switch To Defunct Parties
            </button>
          </>
        )}
        {mode == "defunct" && (
          <>
            <span>Parties that are currently defunct (0 active members)</span>
            <br />
            <button className="btn btn-danger" onClick={switchMode}>
              Switch To Active Parties
            </button>
          </>
        )}
        {sessionData.loggedIn && playerData.nation == country && (
          <>
            <br />
            <LinkContainer to="/createParty" style={{ marginTop: "3px" }}>
              <button className="btn btn-primary">Create Party</button>
            </LinkContainer>
          </>
        )}
        <hr />
        <div className="row w-100">
          <div className="col-5">
            <nav>
              <ul className="pagination mr-0">
                <li className="page-item">
                  <button
                    onClick={() => {
                      if (page != 0) {
                        setPage(page - 9);
                      }
                    }}
                    className="page-link"
                    href="#"
                  >
                    Previous
                  </button>
                </li>
                <li className="page-item">
                  <button onClick={() => setPage(page + 9)} className="page-link" href="#">
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
          <div className="col-7">
            <input
              onChange={(e) => {
                setPartyQuery(e.target.value);
                fetchData();
              }}
              onKeyUp={(e) => {
                if (e.target.value.length < 3) {
                  setPartyQuery(" ");
                  fetchData();
                }
              }}
              style={{ float: "right" }}
              className="form-control w-50"
              type="input"
              placeholder="Search Parties"
            />
          </div>
        </div>
        <div className="row justify-content-center">
          {parties.map((party, idx) => {
            return <PartyCard key={idx} party={party} />;
          })}
        </div>
      </Body>
    );
  } else {
    return (
      <Body>
        <ClipLoader />
      </Body>
    );
  }
}
export default withRouter(PoliticalParties);
