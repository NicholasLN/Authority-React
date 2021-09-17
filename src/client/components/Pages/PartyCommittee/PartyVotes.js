import React, { useEffect, useMemo, useState } from "react";
import { SyncLoader } from "react-spinners";
import PartyInfoService from "../../../service/PartyService";
import PartyVoteTable from "./PartyVoteTable";

function PartyVotes(props) {
  const columns = useMemo(() => [
    {
      Header: "ID",
      accessor: "id",
    },
    {
      Header: "Author",
      accessor: "author",
    },
    {
      Header: "Vote Name",
      accessor: "name",
    },
    {
      Header: "Vote Actions",
      accessor: "actions",
    },
    {
      Header: "Ayes",
      accessor: "ayes",
    },
    {
      Header: "Nays",
      accessor: "nays",
    },
    {
      Header: "Status",
      accessor: "passed",
    },
    {
      Header: "Time Left",
      accessor: "expiresAt",
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);

  const fetchData = async () => {
    var tableDataAPI = await PartyInfoService.fetchPartyVotes(props.partyInfo.id);
    setTableData(tableDataAPI);
    console.log(tableDataAPI);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [props.partyInfo]);

  if (!loading) {
    return <PartyVoteTable data={tableData} columns={columns} />;
  } else {
    return <SyncLoader size={10} />;
  }
}

export default React.memo(PartyVotes);
