import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import "../../../css/polcompass.css";

function PoliticalCompass({ ecoPos, socPos }) {
  var [windowDims, setWindowDims] = useState(() => {
    var { innerWidth: width, innerHeight: height } = window;
    switch (true) {
      case width >= 1000:
        width *= 0.4;
        break;
      case width >= 900 && width < 1000:
        width *= 0.5;
        break;
      case width < 900:
        width *= 0.7;
        break;
    }
    height *= 0.45;

    return { height, width };
  });

  function updateDims() {
    var { innerWidth: width, innerHeight: height } = window;
    switch (true) {
      case width >= 1000:
        width *= 0.4;
        break;
      case width >= 900 && width < 1000:
        width *= 0.5;
        break;
      case width < 900:
        width *= 0.8;
        break;
    }
    height *= 0.45;
    setWindowDims({ height, width });
  }

  useEffect(() => {
    window.addEventListener("resize", updateDims);
    drawChart();
    return () => {
      window.removeEventListener("resize", updateDims);
    };
  });

  var data = [{ x: ecoPos, y: socPos }];
  var margin = { top: 40, right: 50, bottom: 40, left: 50 };
  var domainwidth = windowDims.width - margin.left - margin.right;
  var domainheight = windowDims.height - margin.top - margin.bottom;

  function padExtent(e, p) {
    if (p === undefined) p = 1;
    return [e[0] - p, e[1] + p];
  }

  function drawChart() {
    var svg = d3.select(".viz").html("").append("svg").attr("width", windowDims.width).attr("height", windowDims.height);
    var g = svg.append("g").attr("transform", "translate(" + margin.top + "," + margin.top + ")");
    g.append("rect")
      .attr("width", windowDims.width - margin.left - margin.right)
      .attr("height", windowDims.height - margin.top - margin.bottom)
      .attr("fill", "#F6F6F6");

    var x = d3
      .scaleLinear()
      .domain([-5, 5])
      .range(padExtent([0, domainwidth]));
    var y = d3
      .scaleLinear()
      .domain([-5, 5])
      .range(padExtent([domainheight, 0]));

    // Top Left Rectangle Color (Red)
    g.append("rect")
      .attr("width", (windowDims.width - margin.left - margin.right) / 2)
      .attr("height", (windowDims.height - margin.top - margin.bottom) / 2)
      .attr("fill", "red")
      .attr("opacity", 0.3);

    // Top Right Rectangle Color (Blue)
    g.append("rect")
      .attr("width", (windowDims.width - margin.left - margin.right) / 2)
      .attr("height", (windowDims.height - margin.top - margin.bottom) / 2)
      .attr("fill", "blue")
      .attr("opacity", 0.3)
      .attr("transform", `translate(${x.range()[1] / 2},0)`);

    // Bottom Right Rectangle Color (Purple)
    g.append("rect")
      .attr("width", (windowDims.width - margin.left - margin.right) / 2)
      .attr("height", (windowDims.height - margin.top - margin.bottom) / 2)
      .attr("fill", "purple")
      .attr("opacity", 0.3)
      .attr("transform", `translate(${x.range()[1] / 2},${y.range()[0] / 2})`);

    // Bottom Left Rectangle Color (Green)
    g.append("rect")
      .attr("width", (windowDims.width - margin.left - margin.right) / 2)
      .attr("height", (windowDims.height - margin.top - margin.bottom) / 2)
      .attr("fill", "green")
      .attr("opacity", 0.3)
      .attr("transform", `translate(0,${y.range()[0] / 2})`);

    // X Axis Line
    g.append("g")
      .attr("class", "xAxis")
      .attr("transform", "translate(0," + y.range()[0] / 2 + ")")
      .call(d3.axisBottom(x).ticks(10))
      .selectAll("text")
      .style("display", "none");
    // Y Axis Line
    g.append("g")
      .attr("class", "yAxis")
      .attr("transform", "translate(" + x.range()[1] / 2 + ", 0)")
      .call(d3.axisLeft(y).ticks(10))
      .selectAll("text")
      .style("display", "none");

    g.append("text")
      .attr("class", "alignLabel")
      .text("Left")
      .attr("transform", `translate(${x.range()[0] - 35},${y.range()[0] / 2})`);
    g.append("text")
      .attr("class", "alignLabel")
      .text("Right")
      .attr("transform", `translate(${x.range()[1] + 5},${y.range()[0] / 2})`);

    // Authoritarian
    g.append("text")
      .attr("class", "alignLabel")
      .text("Authoritarian")
      .attr("transform", `translate(${x.range()[1] / 2 - 53}, -10)`);

    g.append("text")
      .attr("class", "alignLabel")
      .text("Libertarian")
      .attr("transform", `translate(${x.range()[1] / 2 - 53}, ${y.range()[0] + 20})`);

    // Lines for each axis tick
    d3.selectAll("g.yAxis g.tick")
      .append("rect")
      .attr("class", "gridline x1")
      .attr("width", (windowDims.width - margin.left - margin.right) / 2)
      .attr("transform", "translate(0,-1)")
      .attr("height", 1);
    d3.selectAll("g.yAxis g.tick")
      .append("rect")
      .attr("class", "gridline x2")
      .attr("width", (windowDims.width - margin.left - margin.right) / 2)
      .attr("height", 1)
      .attr("transform", "rotate(180)");
    d3.selectAll("g.xAxis g.tick")
      .append("rect")
      .attr("class", "gridline y1")
      .attr("height", (windowDims.height - margin.top - margin.bottom) / 2)
      .attr("width", 0.25);
    d3.selectAll("g.xAxis g.tick")
      .append("rect")
      .attr("class", "gridline y2")
      .attr("height", (windowDims.height - margin.top - margin.bottom) / 2)
      .attr("width", 0.25)
      .attr("transform", "rotate(180)");

    data.forEach(function (d) {
      g.selectAll("circle").data(data).enter().append("circle").attr("class", "dot").attr("r", 5).attr("cx", x(d.x)).attr("cy", y(d.y));
    });
  }

  return <div className="viz" />;
}

export default React.memo(PoliticalCompass);
