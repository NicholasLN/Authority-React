import React, { useState, useEffect } from "react";
import { demoSetPopulation } from "../../../../../server/classes/Demographics/Methods";
import CanvasJSReact from "../../../../assets/canvasjs.react";
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default function RaceBreakdown({ demoArray }) {
  const [pieChartData, setPieChartData] = useState([]);

  const generateRaceShare = () => {
    var raceArray = {
      White: 0,
      Black: 0,
      Hispanic: 0,
      Asian: 0,
      "Native American": 0,
      "Pacific Islander": 0,
    };
    var associatedColors = {
      White: "darkgrey",
      Black: "grey",
      Hispanic: "blue",
      Asian: "green",
      "Native American": `#ff6500`,
      "Pacific Islander": "orange",
    };
    var sumPop = demoSetPopulation(demoArray);
    demoArray.map((demo) => {
      switch (demo.race) {
        case "White":
          raceArray["White"] += demo.population;
          break;
        case "Black":
          raceArray["Black"] += demo.population;
          break;
        case "Asian":
          raceArray["Asian"] += demo.population;
          break;
        case "Native American":
          raceArray["Native American"] += demo.population;
          break;
        case "Pacific Islander":
          raceArray["Pacific Islander"] += demo.population;
          break;
        case "Hispanic":
          raceArray["Hispanic"] += demo.population;
          break;
      }
    });

    console.log(raceArray);
    var chartArray = [];

    Object.keys(raceArray).map((k, v) => {
      if (raceArray[k] > 0) {
        var obj = { y: Math.round(raceArray[k]), label: k, share: ((raceArray[k] / sumPop) * 100).toFixed(2), color: associatedColors[k] };
        chartArray.push(obj);
      }
    });
    console.log(chartArray);
    return chartArray;
  };
  var fetchPieChartData = async () => {
    var data = {
      animationEnabled: false,
      data: [
        {
          type: "pie",
          startAngle: 0,
          dataPoints: generateRaceShare(),
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
    <span>
      <CanvasJSChart options={pieChartData} />
    </span>
  );
}
