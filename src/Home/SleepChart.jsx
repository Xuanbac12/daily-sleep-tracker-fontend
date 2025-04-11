import React from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const SleepChart = ({ data }) => {
  console.log("Sleep data:", data);
  return (
    <div className="duration-graph">
<ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 20, bottom: 40, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} />
          <YAxis label={{ value: "Sleep Hours", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Bar dataKey="duration" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
};

export default SleepChart;
