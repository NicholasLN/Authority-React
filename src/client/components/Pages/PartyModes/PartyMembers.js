import React, { useMemo, useState, useEffect, useContext } from "react";
import { SyncLoader } from "react-spinners";
import PartyInfoService from "../../../service/PartyService";
import PartyMemberTable from "./PartyMemberTable";

function PartyMembers(props) {
  const columns = useMemo(
    () => [
      {
        Header: "Politician",
        accessor: "politician",
      },
      {
        Header: "Party Role",
        accessor: "partyRole",
      },
      {
        Header: "Region",
        accessor: "region",
      },
      {
        Header: "Party Influence",
        accessor: "partyInfluence",
      },
      {
        Header: "Votes",
        accessor: "votes",
      },
      {
        Header: "Voting For",
        accessor: "votingFor",
      },
    ],
    []
  );
  const [partyInfo, setPartyInfo] = useState(props.partyInfo);
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      var tableDataAPI = await PartyInfoService.fetchPartyMembers(partyInfo.id);
      console.log(tableDataAPI);
      setTableData(tableDataAPI);
      setLoading(false);
    };
    setPartyInfo(props.partyInfo);
    fetchData();
    return () => {
      setLoading(true);
    };
  }, [props.partyInfo]);

  if (loading) {
    return <SyncLoader size={10} />;
  }
  return (
    <>
      <PartyMemberTable columns={columns} data={tableData} partyInfo={partyInfo} />
    </>
  );
}

export default React.memo(PartyMembers);
