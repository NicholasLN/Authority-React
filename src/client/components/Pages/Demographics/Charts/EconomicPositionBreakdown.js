import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { demoSetPopulation } from "../../../../../server/classes/Demographics/Methods";
import CanvasJSReact from "../../../../assets/canvasjs.react";
import DemographicService from "../../../../service/DemographicService";
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function pyramid(arr) {
  var newArr = [];
  // sort numerically
  arr.sort(function (a, b) {
    return a.y - b.y;
  });

  newArr.push(arr.pop());

  while (arr.length) {
    newArr[arr.length % 2 === 0 ? "push" : "unshift"](arr.pop());
  }
  return newArr;
}

function EconomicPositionBreakdown({ demoArray, mode }) {
  const { country, state, gender, race } = mode;
  const [barChartData, setBarChartData] = useState([]);

  var fetchBarChartData = async () => {
    var resp = pyramid(await DemographicService.generatePoliticalLeanings("economic", true, country, state, race, gender));
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
export default EconomicPositionBreakdown;
