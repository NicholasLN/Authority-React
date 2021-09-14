import React, { useContext, useEffect } from "react";
import { useSortBy, useTable } from "react-table";
import MemberCell from "./MemberTableCell";
import { AlertContext } from "../../../context/AlertContext";
import { UserContext } from "./../../../context/UserContext";
import ReactTooltip from "react-tooltip";
import PartyInfoService from "./../../../service/PartyService";

function PartyMemberTable({ setLoading, fetchData, partyInfo, columns, data }) {
  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: [],
    },
    useSortBy
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;
  const { sessionData, playerData } = useContext(UserContext);
  const { setAlert, setAlertType } = useContext(AlertContext);

  const changeVote = async (voteID) => {
    var newInfo = await PartyInfoService.voteForMember(voteID);
    if (!newInfo.hasOwnProperty("error")) {
      fetchData();
      setLoading(true);
      setAlert("Successfully changed vote.");
      setAlertType("success");
    } else {
      setAlert(newInfo.error);
    }
  };

  useEffect(() => {
    //pass
  }, [partyInfo]);

  return (
    <div className="table-responsive">
      <table className="table table-striped" {...getTableProps()}>
        <thead className="dark">
          {headerGroups.map((headerGroup) => (
            <tr style={{ maxWidth: "13.33%" }} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
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
              return (
                <tr {...row.getRowProps()}>
                  <td>
                    <MemberCell userInfo={row.original.userInfo} />
                  </td>
                  <td>{row.original.role}</td>
                  <td>{row.original.userInfo.userState}</td>
                  <td>
                    {row.original.influence == 0 ? (
                      "0%"
                    ) : (
                      <>
                        <ReactTooltip id={`row${row.id}`}>
                          User Influence: {parseFloat(row.original.influence).toFixed(2)}
                          <br />
                          Total Party Influence: {parseFloat(partyInfo.totalPartyInfluence).toFixed(2)}
                        </ReactTooltip>
                        <span data-tip data-for={`row${row.id}`}>
                          {((row.original.influence / partyInfo.totalPartyInfluence) * 100).toFixed(2)}%
                        </span>
                      </>
                    )}
                  </td>
                  <td>
                    {row.original.votes}
                    {sessionData.loggedIn && playerData.party == partyInfo.id && (
                      <>
                        <br />
                        <button className="btn btn-primary btn-sm" onClick={async () => changeVote(row.original.politicianId)}>
                          Vote For
                        </button>
                      </>
                    )}
                  </td>
                  <td>{row.original.votingFor == 0 ? "Nobody" : <MemberCell userInfo={row.original.votingFor} />}</td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
    </div>
  );
}
export default React.memo(PartyMemberTable);
