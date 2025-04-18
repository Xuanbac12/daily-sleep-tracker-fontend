import React from "react";
import {
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import dayjs from "dayjs";

const formatTime = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h + m / 60;
};

const SleepChart = ({ data }) => {const chartData = data
  .map((item) => {
    const sleep = formatTime(item.sleepTime);
    const wake = formatTime(item.wakeTime);
    const duration = wake < sleep ? wake + 24 - sleep : wake - sleep;
    const dateObj = dayjs(item.date); // giữ ngày gốc
    return {
      date: dateObj.format("DD/MM"), // dùng chuỗi để hiển thị
      duration,
      timestamp: dateObj.valueOf(),  // dùng để sắp xếp
    };
  })
  .sort((a, b) => a.timestamp - b.timestamp) // sắp xếp theo thời gian thật
  .map(({ timestamp, ...rest }) => rest);    // bỏ timestamp sau khi sort


  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 24]} tickFormatter={(v) => `${v}:00`} />
          <Tooltip
            formatter={(value) => [`${value.toFixed(2)} giờ`, "Thời lượng ngủ"]}
            labelFormatter={(label) => `Ngày: ${label}`}
          />
          {/* ❌ Đã bỏ Bar giờ ngủ */}
          <Bar dataKey="duration" fill="#82ca9d" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SleepChart;
