import React, { useContext, useEffect, useState } from "react";
import { useParams, withRouter } from "react-router";
import Body from "./../../Structure/Body";
import LegislatureService from "./../../../service/LegislatureService";
import CountryService from "../../../service/CountryService";
import { AlertContext } from "./../../../context/AlertContext";
import { ClipLoader } from "react-spinners";

function LegislatureOverview(props) {
  var { country } = useParams();
  const { setAlert } = useContext(AlertContext);
  var [countryInfo, setCountryInfo] = useState({});
  var [legislatures, setLegislatures] = useState({});
  var [loading, setLoading] = useState(true);

  async function fetchData() {
    var respCountryInfo = await CountryService.fetchCountryInfo(country);
    console.log(respCountryInfo);
    if (!respCountryInfo.hasOwnProperty("error")) {
      var respLegislatures = await LegislatureService.fetchLegislatures(country);
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
      <Body>
        <br />
        <h1>{countryInfo.name} Legislatures</h1>
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
