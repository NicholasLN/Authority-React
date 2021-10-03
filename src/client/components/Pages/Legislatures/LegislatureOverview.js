import React, { useContext, useEffect, useState } from "react";
import { useParams, withRouter } from "react-router";
import Body from "./../../Structure/Body";
import LegislatureService from "./../../../service/LegislatureService";
import CountryService from "../../../service/CountryService";
import { AlertContext } from "./../../../context/AlertContext";
import { ClipLoader } from "react-spinners";
import Legislature from "./Legislature/Legislature";

function LegislatureOverview(props) {
  var { country } = useParams();
  const { setAlert } = useContext(AlertContext);
  var [countryInfo, setCountryInfo] = useState({});
  var [legislatures, setLegislatures] = useState({});
  var [selectedLegislature, setSelectedLegislature] = useState();
  var [loading, setLoading] = useState(true);

  async function fetchData() {
    var respCountryInfo = await CountryService.fetchCountryInfo(country);
    if (!respCountryInfo.hasOwnProperty("error")) {
      var respLegislatures = await LegislatureService.fetchLegislatures(country);
      console.debug(respLegislatures);
      setCountryInfo(respCountryInfo);
      setLegislatures(respLegislatures);
      setLoading(false);
    } else {
      setAlert(countryInfo.error);
      props.history.push("/");
    }
  }

  useEffect(() => {
    fetchData();
  }, [country]);

  if (!loading) {
    return (
      <Body middleColWidth="11">
        <br />
        <h1>{countryInfo.name} Legislatures</h1>
        <hr />
        <div className="row justify-content-center">
          <div className="col">
            {legislatures.map((legislature) => {
              return (
                <button key={legislature.id} className="btn btn-primary mx-1" onClick={() => setSelectedLegislature(legislature)}>
                  {legislature.name}
                </button>
              );
            })}
          </div>
        </div>
        <hr />
        {selectedLegislature != null && <Legislature legislatureInfo={selectedLegislature} />}
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

export default React.memo(withRouter(LegislatureOverview));
