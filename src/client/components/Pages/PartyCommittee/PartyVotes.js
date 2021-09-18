import React, { useEffect, useMemo, useState } from "react";
import { SyncLoader } from "react-spinners";
import PartyInfoService from "../../../service/PartyService";
import PartyVoteTable from "./PartyVoteTable";
import CanvasJSReact from "./../../../assets/canvasjs.react";
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

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
  const [pieChartData, setPieChartData] = useState([]);
  const [limits, setLimits] = useState({ lowerLimit: 0, upperLimit: 10 });

  var fetchPieChartData = async () => {
    var pcdata = await PartyInfoService.fetchCommitteeChartData(props.partyInfo.id);
    var data = {
      animationEnabled: false,
      data: [
        {
          type: "pie",
          startAngle: 240,
          dataPoints: pcdata,
        },
      ],
      backgroundColor: "transparent",
    };
    setPieChartData(data);
  };

  const nextPage = async () => {
    setLimits({ lowerLimit: limits.lowerLimit + 10, upperLimit: limits.upperLimit + 10 });
    setLoading(true);
  };
  const previousPage = async () => {
    if (limits.lowerLimit != 0) {
      setLimits({ lowerLimit: limits.lowerLimit - 10, upperLimit: limits.upperLimit - 10 });
      setLoading(true);
    }
  };

  const fetchData = async () => {
    var tableDataAPI = await PartyInfoService.fetchPartyVotes(props.partyInfo.id, limits.lowerLimit, limits.upperLimit);
    setTableData(tableDataAPI);
    console.log(tableDataAPI);
    setLoading(false);
  };

  useEffect(() => {
    fetchPieChartData();
    fetchData();
  }, [props.partyInfo, limits]);

  if (!loading) {
    return (
      <div className="row">
        <div className="col-md-8">
          <PartyVoteTable data={tableData} columns={columns} />
          <nav>
            <ul className="pagination">
              <li className="page-item">
                <button onClick={previousPage} className="page-link" href="#">
                  Previous
                </button>
              </li>
              <li className="page-item">
                <button onClick={nextPage} className="page-link" href="#">
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
        <div className="col-md-4">
          <CanvasJSChart options={pieChartData} />
        </div>
      </div>
    );
  } else {
    return (
      <div className="row">
        <div className="col-md-8">
          <SyncLoader />
        </div>
        <div className="col-md-4">
          <CanvasJSChart options={pieChartData} />
        </div>
      </div>
    );
  }
}

export default React.memo(PartyVotes);
