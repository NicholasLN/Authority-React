import React, { useContext, useEffect } from "react";
import { useSortBy, useTable } from "react-table";
import { UserContext } from "./../../../../context/UserContext";
import { AlertContext } from "./../../../../context/AlertContext";
import { LinkContainer } from "react-router-bootstrap";
import PartyInfoService from "../../../../service/PartyService";

function FundingRequestsTable({ fetchPartyData, fetchData, partyInfo, columns, data }) {
  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: [],
    },
    useSortBy
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;
  const { setAlert, setAlertType } = useContext(AlertContext);

  const approveFundingReq = async (requestId) => {
    var resp = await PartyInfoService.approveFundingReq(requestId, partyInfo.id);
    if (!resp.hasOwnProperty("error")) {
      fetchPartyData();
      setAlert("Approved!");
      setAlertType("success");
    } else {
      setAlert(resp.error);
    }
  };
  const denyFundingReq = async (requestId) => {
    var resp = await PartyInfoService.denyFundingReq(requestId, partyInfo.id);
    if (!resp.hasOwnProperty("error")) {
      fetchData();
      setAlert("Denied!");
      setAlertType("success");
    } else {
      setAlert(resp.error);
    }
  };

  useEffect(() => {
    //pass
  }, [data]);

  return (
    <div className="table-responsive">
      <table className="table table-striped" {...getTableProps()}>
        <thead className="dark">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(
                    column.getSortByToggleProps({
                      style: { width: column.width },
                    })
                  )}
                >
                  {column.render("Header")}
                  <span>{column.isSorted ? (column.isSortedDesc ? "↑" : "↓") : ""}</span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {
            // Loop over the table rows
            rows.map((row) => {
              // Prepare the row for display
              prepareRow(row);
              row.original.requestingStr = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(row.original.requesting);
              return (
                <tr {...row.getRowProps()}>
                  <td style={{ textAlign: "left" }}>
                    <LinkContainer to={`/politician/${row.original.author.userID}`}>
                      <a style={{ marginLeft: "9px" }}>
                        <img src={row.original.author.userPicture} style={{ maxWidth: "30px", maxHeight: "30px" }} />
                        <span> {row.original.author.userName}</span>
                      </a>
                    </LinkContainer>
                  </td>
                  <td>
                    {partyInfo.partyTreasury >= row.original.requesting ? (
                      <b>
                        <span className="greenFont">{`${row.original.requestingStr}`}</span>
                      </b>
                    ) : (
                      <b>
                        <span className="redFont">{`${row.original.requestingStr}`}</span>
                      </b>
                    )}
                  </td>
                  <td>{row.original.reason}</td>
                  <td>{row.original.author.userState}</td>
                  <td>
                    <button className="btn btn-primary mx-1" onClick={() => approveFundingReq(row.original.id)}>
                      Accept
                    </button>
                    <button className="btn btn-danger mx-1" onClick={() => denyFundingReq(row.original.id)}>
                      Deny
                    </button>
                  </td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
    </div>
  );
}
export default React.memo(FundingRequestsTable);
