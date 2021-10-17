import React, { useContext, useEffect, useState } from "react";
import billSet from "../../../../assets/billSet.json";
import BillSetForm from "./BillSetForm";
import { AlertContext } from "./../../../../context/AlertContext";
import LegislatureService from "./../../../../service/LegislatureService";
import { withRouter } from "react-router";

function ProposeVote({ history, legislatureInfo }) {
  var [selectedBillType, setSelectedBillType] = useState(null);
  var [formData, setFormData] = useState(null);
  var [voteName, setVoteName] = useState(null);
  var { setAlert, setAlertType } = useContext(AlertContext);

  const changeBillType = (e) => {
    var newBillType = e.target.value;
    var billTypeInformation = billSet[newBillType];
    if (billTypeInformation) {
      setSelectedBillType(billTypeInformation);
    } else {
      setSelectedBillType({ type: newBillType });
    }
  };

  const uploadVote = async () => {
    var postData = { legislatureId: legislatureInfo.id, voteName, billData: formData };
    var resp = await LegislatureService.postVote(postData);
    if (!resp.hasOwnProperty("error")) {
      if (resp.billId) {
        history.push(`/legislatureVote/${resp.billId}`);
        setAlert("Successfully proposed vote.");
        setAlertType("success");
      }
    } else {
      setAlert(resp.error);
    }
  };

  useEffect(() => {
    console.log(legislatureInfo);
  });

  return (
    <>
      <hr />
      <table className="table table-striped">
        <thead className="dark">
          <tr>
            <th style={{ width: "15%" }}>Field</th>
            <th>Input</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <b className="bold">Vote Name</b>
            </td>
            <td>
              <input className="form-control" type="input" placeholder="Vote Name" onChange={(e) => setVoteName(e.target.value)} />
            </td>
          </tr>
          <tr>
            <td>
              <b className="bold">Vote Action(s)</b>
            </td>
            <td>
              <select className="form-control" onChange={changeBillType}>
                <option value=""></option>
                {legislatureInfo.appoints.length != 0 && <option value="appointPosition">Appoint Position</option>}
                {Object.keys(billSet).map((k, v) => {
                  return <option key={v}>{k}</option>;
                })}
              </select>
              {selectedBillType != null && <BillSetForm billSetInformation={selectedBillType} formData={formData} setFormData={setFormData} legislatureInfo={legislatureInfo} />}
            </td>
          </tr>
          <tr>
            <td>
              <b className="bold">Submit</b>
            </td>
            <td>
              <button className="btn btn-primary" onClick={uploadVote}>
                Propose Vote
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

export default React.memo(withRouter(ProposeVote));
