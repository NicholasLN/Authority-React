import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import "../../../css/polcompass.css";

function PoliticalCompass({ ecoPos, socPos }) {
  var [windowDims, setWindowDims] = useState({ width: window.innerWidth * 0.6, height: window.innerHeight * 0.45 });
  function updateDims() {
    var { innerWidth: width, innerHeight: height } = window;
    width *= 0.6;
    height *= 0.45;
    setWindowDims({ height, width });
  }

  useEffect(() => {
    window.addEventListener("resize", updateDims);
    console.log("rerender");
    drawChart();
    return () => {
      window.removeEventListener("resize", updateDims);
    };
  });

  var data = [{ x: ecoPos, y: socPos }];
  var ticks = [-5, -4.5, -4, -3.5, -3, -2.5, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
  var margin = { top: 20, right: 20, bottom: 20, left: 20 };
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
    g.append("rect")
      .attr("width", (windowDims.width - margin.left - margin.right) / 2)
      .attr("height", (windowDims.height - margin.top - margin.bottom) / 2)
      .attr("fill", "red")
      .attr("opacity", 0.3);
    g.append("rect")
      .attr("width", (windowDims.width - margin.left - margin.right) / 2)
      .attr("height", (windowDims.height - margin.top - margin.bottom) / 2)
      .attr("fill", "blue")
      .attr("opacity", 0.3)
      .attr("transform", `translate(${x.range()[1] / 2},0)`);
    g.append("rect")
      .attr("width", (windowDims.width - margin.left - margin.right) / 2)
      .attr("height", (windowDims.height - margin.top - margin.bottom) / 2)
      .attr("fill", "purple")
      .attr("opacity", 0.3)
      .attr("transform", `translate(${x.range()[1] / 2},${y.range()[0] / 2})`);
    g.append("rect")
      .attr("width", (windowDims.width - margin.left - margin.right) / 2)
      .attr("height", (windowDims.height - margin.top - margin.bottom) / 2)
      .attr("fill", "green")
      .attr("opacity", 0.3)
      .attr("transform", `translate(0,${y.range()[0] / 2})`);

    g.append("g")
      .attr("class", "xAxis")
      .attr("transform", "translate(0," + y.range()[0] / 2 + ")")
      .call(d3.axisBottom(x).ticks(10));

    g.append("g")
      .attr("class", "yAxis")
      .attr("transform", "translate(" + x.range()[1] / 2 + ", 0)")
      .call(d3.axisLeft(y).ticks(10));

    d3.selectAll("g.yAxis g.tick")
      .append("rect")
      .attr("class", "gridline")
      .attr("width", (windowDims.width - margin.left - margin.right) / 2)
      .attr("height", 0.25);
    d3.selectAll("g.yAxis g.tick")
      .append("rect")
      .attr("class", "gridline")
      .attr("width", (windowDims.width - margin.left - margin.right) / 2)
      .attr("height", 0.25)
      .attr("transform", "rotate(180)");
    d3.selectAll("g.xAxis g.tick")
      .append("rect")
      .attr("class", "gridline")
      .attr("height", (windowDims.height - margin.top - margin.bottom) / 2)
      .attr("width", 0.25);
    d3.selectAll("g.xAxis g.tick")
      .append("rect")
      .attr("class", "gridline")
      .attr("height", (windowDims.height - margin.top - margin.bottom) / 2)
      .attr("width", 0.25)
      .attr("transform", "rotate(180)");

    data.forEach(function (d) {
      g.selectAll("circle").data(data).enter().append("circle").attr("class", "dot").attr("r", 8).attr("cx", x(d.x)).attr("cy", y(d.y));
    });
  }

  return <div className="viz" />;
}

export default React.memo(PoliticalCompass);
