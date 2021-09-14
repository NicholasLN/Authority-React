import React, { useContext } from "react";
import { useSortBy, useTable } from "react-table";
import MemberCell from "./MemberTableCell";
import { AlertContext } from "../../../context/AlertContext";
import { UserContext } from "./../../../context/UserContext";

export default function PartyMemberTable({ partyInfo, columns, data }) {
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
              console.log(row);
              return (
                <tr {...row.getRowProps()}>
                  <td>
                    <MemberCell userInfo={row.original.userInfo} />
                  </td>
                  <td>{row.original.role}</td>
                  <td>{row.original.userInfo.userState}</td>
                  <td>{row.original.influence}</td>
                  <td>
                    {row.original.votes}
                    {sessionData.loggedIn && playerData.party == partyInfo.id && (
                      <>
                        <br />
                        <button className="btn btn-primary btn-sm">Vote For</button>
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
