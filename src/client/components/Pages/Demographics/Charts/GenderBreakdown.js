import React, { useState, useEffect } from "react";
import { demoSetPopulation } from "../../../../../server/classes/Demographics/Methods";
import CanvasJSReact from "../../../../assets/canvasjs.react";
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function GenderBreakdown({ className, demoArray }) {
  const [pieChartData, setPieChartData] = useState([]);

  const generateGenderShare = () => {
    var genderArray = {
      Male: 0,
      Female: 0,
      "Transgender/Nonbinary": 0,
    };
    var associatedColors = {
      Male: "#99ace0",
      Female: "#ff748c",
      "Transgender/Nonbinary": "#CA93CA",
    };
    var sumPop = demoSetPopulation(demoArray);
    demoArray.map((demo) => {
      switch (demo.gender) {
        case "Male":
          genderArray["Male"] += demo.population;
          break;
        case "Female":
          genderArray["Female"] += demo.population;
          break;
        case "Transgender/Nonbinary":
          genderArray["Transgender/Nonbinary"] += demo.population;
          break;
      }
    });

    var chartArray = [];

    Object.keys(genderArray).map((k, v) => {
      var obj = { y: Math.round(genderArray[k]), label: k, share: ((genderArray[k] / sumPop) * 100).toFixed(2), color: associatedColors[k] };
      chartArray.push(obj);
    });
    return chartArray;
  };
  var fetchPieChartData = async () => {
    var data = {
      animationEnabled: false,
      data: [
        {
          type: "pie",
          startAngle: 0,
          dataPoints: generateGenderShare(),
        },
      ],
      backgroundColor: "transparent",
    };
    setPieChartData(data);
  };

  useEffect(() => {
    fetchPieChartData();
  }, [demoArray]);

  return (
    <span className="chart">
      <CanvasJSChart options={pieChartData} />
    </span>
  );
}
export default React.memo(GenderBreakdown);
