import React, { useState, useEffect, useContext } from "react";
import { BeatLoader } from "react-spinners";
import { withRouter, useParams } from "react-router";
import DemographicService from "../../../service/DemographicService";
import { AlertContext } from "./../../../context/AlertContext";
import Body from "../../Structure/Body";
import GenderBreakdown from "./Charts/GenderBreakdown";
import RaceBreakdown from "./Charts/RaceBreakDown";
import StateDropdown from "./../../Misc/StateDropdown";
import DemographicTable from "./Table/DemographicTable";
import EconomicPositionBreakdown from "./Charts/EconomicPositionBreakdown";
import SocialPositionBreakdown from "./Charts/SocialPositionBreakdown";

function DemographicOverview(props) {
  const { country, state, gender, race } = useParams();
  const [loading, setLoading] = useState(true);
  const [demographics, setDemographics] = useState([]);
  const { setAlert } = useContext(AlertContext);
  const [queryTerms, setQueryTerms] = useState({
    country: country,
    state: state,
    gender: gender,
    race: race,
  });

  async function fetchDemographics() {
    var resp = await DemographicService.fetchDemographicArray(queryTerms.country, queryTerms.state, queryTerms.race, queryTerms.gender);
    if (!resp.hasOwnProperty("error")) {
      setDemographics(resp);
      setLoading(false);
    } else {
      setAlert("Error fetching demographics.");
      props.history.push("/");
    }
  }
  useEffect(() => {
    fetchDemographics();
  }, []);

  function changeState(e) {
    console.log(e);
    const terms = queryTerms;
    terms.state = e.value;
    setQueryTerms(terms);
    fetchDemographics();
  }

  if (!loading) {
    return (
      <Body middleColWidth={11}>
        <br />
        <h3>Demographics</h3>
        <hr />
        <div className="row justify-content-center">
          <div className="col-md-6">{<GenderBreakdown demoArray={demographics} />}</div>
          <div className="col-md-6">{<RaceBreakdown demoArray={demographics} />}</div>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="row justify-content-center">
              <h5>Parameter Search</h5>
              <table className="table table-striped">
                <thead className="dark">
                  <tr>
                    <th style={{ width: "33%" }}>State</th>
                    <th style={{ width: "33%" }}>Race</th>
                    <th style={{ width: "33%" }}>Gender</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <StateDropdown onChange={changeState} />
                    </td>
                    <td>
                      <select
                        className="form-control mt-0"
                        onChange={(e) => {
                          const terms = queryTerms;
                          terms.race = e.target.value;
                          setQueryTerms(terms);
                          fetchDemographics();
                        }}
                        defaultValue={queryTerms.race}
                      >
                        <option value="all">All</option>
                        <option value="white">White</option>
                        <option value="black">Black</option>
                        <option value="hispanic">Hispanic</option>
                        <option value="asian">Asian</option>
                        <option value="native american">Native American</option>
                        <option value="pacific islander">Pacific Islander</option>
                      </select>
                    </td>
                    <td>
                      <select
                        className="form-control mt-0"
                        onChange={(e) => {
                          const terms = queryTerms;
                          terms.gender = e.target.value;
                          setQueryTerms(terms);
                          fetchDemographics();
                        }}
                        defaultValue={queryTerms.gender}
                      >
                        <option value="all">All</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="transgender/nonbinary">Transgender/Nonbinary</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="row justify-content-center">
              <h5>Demographic Table</h5>
              <DemographicTable data={demographics} />
            </div>
          </div>
          <div className="col-md-4">
            <h4>Economic Positions Breakdown</h4>
            <EconomicPositionBreakdown demoArray={demographics} mode={queryTerms} />
            <h4>Social Positions Breakdown</h4>
            <SocialPositionBreakdown demoArray={demographics} mode={queryTerms} />
          </div>
        </div>
      </Body>
    );
  } else {
    return (
      <Body>
        <br />
        <h3>Demographics</h3>
        <BeatLoader />
      </Body>
    );
  }
}

export default DemographicOverview;
