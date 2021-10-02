import React, { useEffect, useState } from "react";
import Body from "../Structure/Body";
import PatronService from "./../../service/PatronService";

export default function Credits() {
  const [patrons, setPatrons] = useState([]);

  async function fetchPatrons() {
    var resp = await PatronService.getPatrons();
    console.log(resp);
    if (!resp.hasOwnProperty("error")) {
      setPatrons(resp);
    }
  }

  useEffect(() => {
    fetchPatrons();
  }, []);

  return (
    <Body middleColWidth="11">
      <h1>Credits and Thanks</h1>
      <div className="row">
        <div className="col-md-6">
          <h4>Contribution Credits:</h4>
          <hr />
          <b className="bold">Main Developer:</b> Phil Scott
          <br />
          <b className="bold">Contributors:</b> Tadeo/Rainbow (Skyler Mizuki)
          <br />
          <b className="bold">Demographic Research:</b> Rainbow (Skyler Mizuki)
        </div>
        <div className="col-md-6">
          <h4>Patrons</h4>
          <hr />
          <p>A very special thanks to this group of contributors for helping with the expenses of this project.</p>
          <div className="row">
            <div className="col-md-4">
              <b className="bold">AUTHORITY Bronze Patrons:</b>
              {Object.keys(patrons).map((patron) => {
                let patr = patrons[patron];
                if (patr.rank == "bronze") {
                  return (
                    <div key={patr.id}>
                      <p>{patr.discord}</p>
                      <br />
                    </div>
                  );
                }
              })}
              <br />
            </div>
            <div className="col-md-4">
              <b className="bold">AUTHORITY Silver Patrons:</b>
              {Object.keys(patrons).map((patron) => {
                let patr = patrons[patron];
                if (patr.rank == "silver") {
                  return (
                    <div key={patr.id}>
                      <p>{patr.discord}</p>
                      <br />
                    </div>
                  );
                }
              })}
              <br />
            </div>
            <div className="col-md-4">
              <b className="bold">AUTHORITY Gold Patrons:</b>
              {Object.keys(patrons).map((patron) => {
                let patr = patrons[patron];
                if (patr.rank == "gold") {
                  return (
                    <div key={patr.id}>
                      <p>{patr.discord}</p>
                      <br />
                    </div>
                  );
                }
              })}
              <br />
            </div>
          </div>
        </div>
      </div>
    </Body>
  );
}
