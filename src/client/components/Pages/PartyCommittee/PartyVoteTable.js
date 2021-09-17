import React, { useContext, useEffect, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { SyncLoader } from "react-spinners";
import { useSortBy, useTable } from "react-table";
import ReactTooltip from "react-tooltip";
import timeago from "time-ago";
import MemberCell from "../PartyModes/MemberTableCell";

function PartyVoteTable({ columns, data }) {
  var [loading, setLoading] = useState(true);
  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: [],
    },
    useSortBy
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;
  useEffect(() => {
    setLoading(false);
  });

  if (!loading) {
    return (
      <div className="table-responsive">
        <table className="table table-striped" {...getTableProps()}>
          <thead className="dark">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
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
                    <td>{row.original.id}</td>
                    <td>
                      <MemberCell includePic={false} userInfo={row.original.author} />
                    </td>
                    <td>
                      <LinkContainer to={`/partyVote/${row.original.id}`}>
                        <a>{row.original.name}</a>
                      </LinkContainer>
                    </td>
                    <td>
                      {(row.original.actionString.match(/<br/g) || []).length > 0 ? (
                        <>
                          <ReactTooltip id={`${row.original.id}-ActionToolTip`} className="extraClass" delayShow={500} effect="float">
                            <span dangerouslySetInnerHTML={{ __html: row.original.actionString }} />
                          </ReactTooltip>
                          <span data-tip data-for={`${row.original.id}-ActionToolTip`}>
                            <u>Hover over me</u>
                          </span>
                        </>
                      ) : (
                        <span dangerouslySetInnerHTML={{ __html: row.original.actionString }} />
                      )}
                    </td>
                    <td>{row.original.sumAyes}</td>
                    <td>{row.original.sumNays}</td>
                    <td>
                      <span dangerouslySetInnerHTML={{ __html: row.original.statusString }} />
                    </td>
                    <td>
                      {row.original.passed == -1 ? (
                        <span>{timeago.ago(row.original.expiresAt).replace("hours from now", "hours")}</span>
                      ) : (
                        <span dangerouslySetInnerHTML={{ __html: row.original.statusString }} />
                      )}
                    </td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>
    );
  } else {
    return <SyncLoader />;
  }
}
export default React.memo(PartyVoteTable);
