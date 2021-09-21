import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "./../../../context/UserContext";
import { AlertContext } from "./../../../context/AlertContext";
import { userHasPerm } from "../../../../server/classes/Party/Methods";
import PartyMemberSearch from "../../Misc/PartyMemberSearch";
import { withRouter } from "react-router";
import bank from "../../../css/images/otherPics/bankLogo.png";
import cash from "../../../css/images/otherPics/cashLogo.png";
import FundingRequestsTable from "./PartyTreasury/FundingRequestsTable";
import PartyInfoService from "../../../service/PartyService";

function PartyTreasury(props) {
  var { sessionData, playerData } = useContext(UserContext);
  var [sendMoneyTo, setSendMoneyTo] = useState(0);
  var { setAlert, setAlertType } = useContext(AlertContext);
  var [fundingReqData, setFundingReqData] = useState([]);
  var [newFundReqData, setNewFundReqData] = useState({ amount: 0, reason: "" });
  var [donateAmount, setDonateAmount] = useState(0);
  var [sendAmount, setSendAmount] = useState(0);
  var [page, setPage] = useState(0);

  var onSubmitNewRequest = async () => {
    var resp = await PartyInfoService.submitNewFundRequest(newFundReqData.amount, newFundReqData.reason);
    if (!resp.hasOwnProperty("error")) {
      fetchTableData();
      setAlert("Successfully made a new funding request.");
      setAlertType("success");
    } else {
      setAlert(resp.error);
    }
  };
  var onChangeFundReqData = (e) => {
    if (e.target.name == "reqAmount") {
      var newData = newFundReqData;
      newData.amount = parseInt(e.target.value);
      setNewFundReqData(newData);
    }
    if (e.target.name == "reqReason") {
      var newData = newFundReqData;
      newData.reason = e.target.value;
      setNewFundReqData(newData);
    }
  };
  var onDonateMoney = async () => {
    if (donateAmount > 0) {
      var resp = await PartyInfoService.donateMoney(donateAmount);
      if (!resp.hasOwnProperty("error")) {
        setAlert("Successfully donated money to the party.");
        setAlertType("success");
        props.fetchPartyData();
      } else {
        setAlert(resp.error);
      }
    }
  };
  var onSendFunds = async () => {
    if (sendAmount > 0) {
      var resp = await PartyInfoService.sendMoney(sendMoneyTo, sendAmount);
      if (!resp.hasOwnProperty("error")) {
        setAlert("Successfully sent the money.");
        setAlertType("success");
        props.fetchPartyData();
      } else {
        setAlert(resp.error);
      }
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Politician",
        accessor: "id",
        width: "20%",
      },
      {
        Header: "Requesting",
        accessor: "requesting",
        width: "30%",
      },
      {
        Header: "Reason",
        accessor: "reason",
        width: "30%",
      },
      {
        Header: "State",
        width: "5%",
      },
      {
        Header: "Approve/Deny",
        width: "auto",
      },
    ],
    []
  );

  async function fetchTableData() {
    var data = await PartyInfoService.fetchTreasuryData(props.partyInfo.id, 10, page);
    setFundingReqData(data);
  }

  useEffect(() => {
    if (sessionData.loggedIn && playerData.party == props.partyInfo.id) {
      fetchTableData();
    } else {
      props.history.push("/");
      setAlert("NO. NO. YOU DO NOT BELONG HERE!");
    }
  }, [props.partyInfo, sendMoneyTo, page]);

  return (
    <>
      <div className="row">
        <div className="col-sm">
          <img style={{ maxWidth: "150px", maxHeight: "150px" }} src={bank} />
          <h4 style={{ marginTop: "4px" }}>Party Treasury</h4>
          <table className="table table-striped">
            <thead className="dark">
              <tr>
                <th colSpan="3"></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <b>Available Funds</b>
                </td>
                <td colSpan="2">
                  <b>
                    <span className="greenFont">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(props.partyInfo.partyTreasury)}</span>
                  </b>
                </td>
              </tr>
              {sessionData.loggedIn && (userHasPerm(sessionData.loggedInId, props.partyInfo, "leader") || userHasPerm(sessionData.id, props.partyInfo, "sendFunds")) && (
                <tr>
                  <td>
                    <b>Send Funds</b>
                  </td>
                  <td>
                    <input className="form-control" onChange={(e) => setSendAmount(e.target.value)} type="number" placeholder="Amount" />
                    <PartyMemberSearch onChange={setSendMoneyTo} partyInfo={props.partyInfo} />
                  </td>
                  <td>
                    <button className="btn btn-primary" onClick={onSendFunds}>
                      Send Funds
                    </button>
                  </td>
                </tr>
              )}
              <tr>
                <td>
                  <b>Donate Funds</b>
                </td>
                <td>
                  <input
                    className="form-control"
                    type="number"
                    placeholder={`Amount (you have ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(playerData.campaignFinance)})`}
                    onChange={(e) => setDonateAmount(e.target.value)}
                  />
                </td>
                <td>
                  <button onClick={onDonateMoney} className="btn btn-primary">
                    Donate
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="col-sm">
          <img style={{ maxWidth: "150px", maxHeight: "150px" }} src={cash} />
          <h4>Funding Requests</h4>
          <table className="table table-striped">
            <thead className="dark">
              <tr>
                <th style={{ width: "40%" }}>Amount</th>
                <th style={{ width: "20%" }}>Reason</th>
                <th style={{ width: "20%" }}>Request</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input className="form-control" type="number" name="reqAmount" onChange={onChangeFundReqData} placeholder="Amount ($)" />
                </td>
                <td>
                  <input className="form-control" type="input" name="reqReason" onChange={onChangeFundReqData} placeholder="Reason (50 chars.)" />
                </td>
                <td>
                  <button className="btn btn-primary" onClick={onSubmitNewRequest}>
                    Request Money
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          {(userHasPerm(sessionData.loggedInId, props.partyInfo, "leader") ||
            userHasPerm(sessionData.loggedInId, props.partyInfo, "sendFunds") ||
            userHasPerm(sessionData.loggedInId, props.partyInfo, "approveFundingReq")) && (
            <>
              <FundingRequestsTable fetchPartyData={props.fetchPartyData} fetchData={fetchTableData} columns={columns} data={fundingReqData} partyInfo={props.partyInfo} />
              <nav>
                <ul className="pagination">
                  <li className="page-item">
                    <button
                      onClick={() => {
                        if (page != 0) {
                          setPage(page - 10);
                        }
                      }}
                      className="page-link"
                      href="#"
                    >
                      Previous
                    </button>
                  </li>
                  <li className="page-item">
                    <button onClick={() => setPage(page + 10)} className="page-link" href="#">
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default React.memo(withRouter(PartyTreasury));
