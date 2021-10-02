import React, { useEffect, useState } from "react";
import { useTable, useSortBy } from "react-table";

function LegislatureVoteTable({ columns, data }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
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
                return <p>Ok</p>;
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

export default LegislatureVoteTable;
