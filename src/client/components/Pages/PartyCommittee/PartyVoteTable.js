import React from "react";
import DataTable from "react-data-table-component";
import dataTableTheme from "./../../Misc/DataTableTheme";

const headers = [
  {
    name: "ID",
    selector: (row) => row["voteId"],
    sortable: true,
    center: true,
  },
  {
    name: "Name",
    selector: (row) => row["voteName"],
    center: true,
  },
  {
    name: "Vote Action",
    selector: (row) => row["voteAction"],
    center: true,
  },
  {
    name: "Ayes",
    selector: (row) => row["ayes"],
    center: true,
  },
  {
    name: "Nays",
    selector: (row) => row["nays"],
    center: true,
  },
  {
    name: "Status",
    selector: (row) => row["status"],
    center: true,
  },
];

const data = [{ voteId: "a", voteName: "a", voteAction: "a", ayes: "a", nays: "a", status: "a" }];

function PartyVoteTable(props) {
  return <DataTable responsive columns={headers} data={data} customStyles={dataTableTheme} pagination striped />;
}

export default React.memo(PartyVoteTable);
