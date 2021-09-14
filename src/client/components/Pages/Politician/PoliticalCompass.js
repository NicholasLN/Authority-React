import React from "react";
import { CartesianGrid, Scatter, ScatterChart, XAxis, YAxis, Cell, ReferenceLine, Tooltip, LabelList, Label, ResponsiveContainer } from "recharts";

export default function PoliticalCompass({ width, height, ecoPos, socPos }) {
  var data = [{ x: ecoPos, y: socPos }];
  var ticks = [-5, -4.5, -4, -3.5, -3, -2.5, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
  return (
    <ResponsiveContainer width={width} height={height}>
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid />
        <XAxis tickCount={20} ticks={ticks} allowDecimals={true} domain={[-5, 5]} type="number" dataKey="x" name="Economic Stance: " />
        <YAxis tickCount={20} ticks={ticks} allowDecimals={true} domain={[-5, 5]} type="number" dataKey="y" name="Social Stance: " />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
        <ReferenceLine y={0} stroke="#000000">
          <Label value="Left" position="insideLeft" color="blue" />
          <Label value="Right" position="insideRight" color="red" />
        </ReferenceLine>
        <ReferenceLine x={0} stroke="#000000">
          <Label value="Authoritarian" position="insideTop" />
          <Label value="Libertarian" position="insideBottom" />
        </ReferenceLine>
        <Scatter name="Political Compass" data={data} fill="#8884d8"></Scatter>
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
