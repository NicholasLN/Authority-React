import React, { useState, useEffect, useMemo } from "react";
import LegislatureService from "./../../../../service/LegislatureService";
import { ClipLoader } from "react-spinners";
import LegislatureVoteTable from "./LegislatureVoteTable";

function LegislatureVotes({ legislatureInfo }) {
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
  var [legislatureVotes, setLegislatureVotes] = useState();
  var [loading, setLoading] = useState(true);
  async function fetchVotes() {
    var resp = await LegislatureService.fetchLegislatureVotes(legislatureInfo.id);
    console.debug(resp);
    if (!resp.hasOwnProperty("error")) {
      setLegislatureVotes(resp);
    }
    setLoading(false);
  }
  useEffect(() => {
    fetchVotes();
    return () => setLoading(true);
  }, []);

  if (!loading) {
    return (
      <>
        <br />
        <LegislatureVoteTable columns={columns} data={legislatureVotes} />
      </>
    );
  } else {
    return (
      <>
        <br />
        <ClipLoader />
      </>
    );
  }
}

export default LegislatureVotes;
