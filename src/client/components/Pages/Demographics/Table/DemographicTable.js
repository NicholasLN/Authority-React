import React, { useEffect } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { getPositionName, selectColor } from "../../../../../server/classes/Misc/Methods";

export default function DemographicTable({ data }) {
  var columns = React.useMemo(
    () => [
      {
        Header: "Race",
        accessor: "race",
        width: "13%",
      },
      {
        Header: "Gender",
        accessor: "gender",
        width: "20%",
      },
      {
        Header: "Region",
        accessor: "state",
        width: "5%",
      },
      {
        Header: "Population",
        accessor: "population",
        width: "auto",
      },
      {
        Header: "Turnout",
        accessor: "turnout",
        width: "auto",
      },
      {
        Header: "Average Economic Position",
        accessor: "ecoPosMean",
        width: "auto",
      },
      {
        Header: "Average Social Position",
        accessor: "socPosMean",
        width: "auto",
      },
    ],
    []
  );

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    useSortBy,
    usePagination
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    pageOptions,
    page,
    state: { pageIndex, pageSize },
    gotoPage,
    previousPage,
    nextPage,
    setPageSize,
    canPreviousPage,
    pageCount,
    canNextPage,
  } = tableInstance;

  useEffect(() => {}, [data]);

  return (
    <>
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
              page.map((row) => {
                // Prepare the row for display
                prepareRow(row);
                return (
                  <tr>
                    <td>{row.original.race}</td>
                    <td>{row.original.gender}</td>
                    <td>{row.original.state}</td>
                    <td>{row.original.population.toLocaleString()}</td>
                    <td>100%</td>
                    <td>
                      {
                        <span style={{ color: selectColor(["blue", "#101010", "red"], row.original.ecoPosMean) }}>
                          {" " + getPositionName("economic", row.original.ecoPosMean)} ({row.original.ecoPosMean})
                        </span>
                      }
                    </td>
                    <td>
                      {
                        <span style={{ color: selectColor(["blue", "#101010", "red"], row.original.socPosMean) }}>
                          {" " + getPositionName("social", row.original.socPosMean)} ({row.original.socPosMean})
                        </span>
                      }
                    </td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>
      <div className="pagination mb-3">
        <button className="btn btn-primary rounded-0" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>{" "}
        <button className="btn btn-primary rounded-0" onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>{" "}
        <button className="btn btn-danger rounded-0" onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </button>{" "}
        <button className="btn btn-danger rounded-0" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>{" "}
        <span className="mx-3 mt-1">
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <span>
          Go to page:{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
          />
        </span>
      </div>
    </>
  );
}
