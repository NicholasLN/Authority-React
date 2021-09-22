import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { demoSetPopulation } from "../../../../../server/classes/Demographics/Methods";
import CanvasJSReact from "../../../../assets/canvasjs.react";
import DemographicService from "../../../../service/DemographicService";
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function SocialPositionBreakdown({ demoArray, mode }) {
  const { country, state, gender, race } = mode;
  const [barChartData, setBarChartData] = useState([]);

  var fetchBarChartData = async () => {
    var resp = await DemographicService.generatePoliticalLeanings("social", true, country, state, race, gender);
    var data = {
      animationEnabled: false,
      data: [
        {
          type: "column",
          startAngle: 0,
          dataPoints: resp,
        },
      ],
      backgroundColor: "transparent",
    };
    setBarChartData(data);
  };
  useEffect(() => {
    fetchBarChartData();
  }, [demoArray]);

  return (
    <span className="chart">
      <CanvasJSChart options={barChartData} />
    </span>
  );
}
export default SocialPositionBreakdown;
