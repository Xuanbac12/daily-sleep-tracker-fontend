import React from "react";
import "./SleepAnalysis.css"; // Import CSS styles for the component

const SleepAnalysis = ({ records }) => {
  if (!records || records.length === 0) return <p>No data</p>;

  const durations = records.map(r => r.duration);
  const avgDuration = (durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(2);

  const below6h = durations.filter(d => d < 6).length;
  const above8h = durations.filter(d => d > 8).length;

  const avgTime = (timeList) => {
    const totalMinutes = timeList.reduce((acc, t) => {
      const [h, m] = t.split(":").map(Number);
      return acc + h * 60 + m;
    }, 0);
    const avg = totalMinutes / timeList.length;
    const avgH = Math.floor(avg / 60);
    const avgM = Math.floor(avg % 60);
    return `${avgH.toString().padStart(2, "0")}:${avgM.toString().padStart(2, "0")}`;
  };

  const avgSleepTime = avgTime(records.map(r => r.sleepTime));
  const avgWakeTime = avgTime(records.map(r => r.wakeTime));

  return (
    <div className="analysis-box">
    <h3>Weekly Sleep Analysis</h3>
    <ul className="analysis-list">
      <li>🕐 Trung bình thời gian ngủ trong tuần: <strong>{avgDuration} giờ</strong></li>
      <li>🌙 Số ngày ngủ &lt; 6 giờ: <strong>{below6h}</strong></li>
      <li>💤 Số ngày ngủ &gt; 8 giờ: <strong>{above8h}</strong></li>
      <li>🛏️ Trung bình thời gian đi ngủ: <strong>{avgSleepTime}</strong></li>
      <li>🌞 Trung bình thời gian thức dậy: <strong>{avgWakeTime}</strong></li>
    </ul>
  </div>
  
  );
};

export default SleepAnalysis;
