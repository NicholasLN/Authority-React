import React, { useEffect, useState } from "react";
import { useTable, useSortBy } from "react-table";
import MemberCell from "./../../Party/MemberTableCell";
import timeago from "time-ago";
import { LinkContainer } from "react-router-bootstrap";

function LegislatureVoteTable({ columns, data }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
    return () => {
      setLoading(true);
    };
  }, []);
  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: [],
    },
    useSortBy
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;
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
                  <tr key={row.id}>
                    <td>{row.original.id}</td>
                    <td>
                      <MemberCell userInfo={row.original.author} />
                    </td>
                    <td>
                      <LinkContainer to={`/legislatureVote/${row.original.id}`}>
                        <a>{row.original.name}</a>
                      </LinkContainer>
                    </td>
                    <td>
                      <span dangerouslySetInnerHTML={{ __html: row.original.actionString }} />
                      {row.original.constitutional ? (
                        <>
                          <br />
                          <b className="bold">Constitutional Vote!</b>
                        </>
                      ) : null}
                    </td>
                    <td>{row.original.sumAyes}</td>
                    <td>{row.original.sumNays}</td>
                    <td>
                      <span dangerouslySetInnerHTML={{ __html: row.original.statusString }} />
                    </td>
                    <td>
                      {row.original.passed == -1 ? (
                        <>
                          <span>{timeago.ago(row.original.expiresAt)}</span>
                          {row.original.delay == 1 && (
                            <span className="redFont">
                              <br />
                              Delayed! (+12 hours)
                            </span>
                          )}
                        </>
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
    return <br />;
  }
}

export default React.memo(LegislatureVoteTable);
