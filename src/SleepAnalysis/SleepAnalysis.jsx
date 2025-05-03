import React from "react";
import "./SleepAnalysis.css";

const SleepAnalysis = ({ records }) => {
  if (!records || records.length === 0) return <p>Không có dữ liệu trong tuần này.</p>;

  const durations = records.map(r => Number(r.duration));
  const avgDuration = (durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(2);
  const below6h = durations.filter(d => d < 6).length;
  const above8h = durations.filter(d => d > 8).length;

  // ✅ Hàm tính trung bình thời gian (có thể dùng cho cả sleepTime và wakeTime)
  const avgTime = (timeList, isSleep = false) => {
    const totalMinutes = timeList.reduce((acc, t) => {
      let [h, m] = t.split(":").map(Number);

      // ✅ Nếu là sleepTime và giờ < 12h (ban đêm) thì cộng 24h để không bị tính sai
      if (isSleep && h < 12) {
        h += 24;
      }

      return acc + h * 60 + m;
    }, 0);

    const avg = totalMinutes / timeList.length;
    const avgH = Math.floor(avg / 60) % 24;
    const avgM = Math.floor(avg % 60);

    return `${avgH.toString().padStart(2, "0")}:${avgM.toString().padStart(2, "0")}`;
  };

  const avgSleepTime = avgTime(records.map(r => r.sleepTime), true);  // ✅ xử lý giờ đi ngủ ban đêm
  const avgWakeTime = avgTime(records.map(r => r.wakeTime), false);   // ❌ không cộng 24h cho giờ thức

  return (
    <div className="analysis-box">
      <h3>Bảng phân tích thời gian ngủ trong tuần</h3>
      <ul className="analysis-list">
        <li>🕐 Trung bình thời gian ngủ trong tuần(T2-CN): <strong>{avgDuration} giờ</strong></li>
        <li>🌙 Số ngày ngủ &lt; 6 giờ: <strong>{below6h}</strong></li>
        <li>💤 Số ngày ngủ &gt; 8 giờ: <strong>{above8h}</strong></li>
        <li>🛏️ Trung bình thời gian đi ngủ: <strong>{avgSleepTime}</strong></li>
        <li>🌞 Trung bình thời gian thức dậy: <strong>{avgWakeTime}</strong></li>
      </ul>
    </div>
  );
};

export default SleepAnalysis;
