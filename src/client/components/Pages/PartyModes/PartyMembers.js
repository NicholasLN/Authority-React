import React, { useEffect, useMemo, useState } from "react";
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
  const [page, setPage] = useState(0);

  const fetchData = async () => {
    var tableDataAPI = await PartyInfoService.fetchPartyMembers(partyInfo.id, page);
    setTableData(tableDataAPI);
    setLoading(false);
  };

  useEffect(() => {
    setPartyInfo(props.partyInfo);
    fetchData();
    return () => {
      setLoading(true);
    };
  }, [props.partyInfo, page]);

  if (loading) {
    return <SyncLoader size={10} />;
  }
  return (
    <>
      <PartyMemberTable fetchData={fetchData} setLoading={setLoading} columns={columns} data={tableData} partyInfo={partyInfo} />
      <nav>
        <ul className="pagination">
          <li className="page-item">
            <button
              onClick={() => {
                if (page != 0) {
                  setPage(page - 10);
                }
              }}
              className="page-link"
              href="#"
            >
              Previous
            </button>
          </li>
          <li className="page-item">
            <button onClick={() => setPage(page + 10)} className="page-link" href="#">
              Next
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default React.memo(PartyMembers);
