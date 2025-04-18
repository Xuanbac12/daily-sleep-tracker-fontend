import React from "react";
import dayjs from "dayjs";
import "./SleepAnalysis.css";
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(isoWeek);



const SleepAnalysis = ({ records }) => {
  if (!records || records.length === 0) return <p>No data</p>;

  // 👉 Lọc bản ghi thuộc cùng tuần hiện tại
  const today = dayjs();
  const currentWeek = today.isoWeek();
  const currentYear = today.year();

  const weekRecords = records.filter(r => {
    const date = dayjs(r.date);
    return date.isoWeek() === currentWeek && date.year() === currentYear;
  });

  if (weekRecords.length === 0) return <p>Không có dữ liệu trong tuần này.</p>;

  const durations = weekRecords.map(r => Number(r.duration));
  const avgDuration = (durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(2);
  const below6h = durations.filter(d => d < 6).length;
  const above8h = durations.filter(d => d > 8).length;

  const avgTime = (timeList, isWakeTime = false) => {
    const totalMinutes = timeList.reduce((acc, t) => {
      let [h, m] = t.split(":").map(Number);

      // ✅ Nếu là wakeTime và trước 5 giờ sáng → cộng thêm 24h để tính toán chính xác
      if (isWakeTime && h < 5) {
        h += 24;
      }

      return acc + h * 60 + m;
    }, 0);

    const avg = totalMinutes / timeList.length;
    const avgH = Math.floor(avg / 60) % 24;
    const avgM = Math.floor(avg % 60);

    return `${avgH.toString().padStart(2, "0")}:${avgM.toString().padStart(2, "0")}`;
  };

  const avgSleepTime = avgTime(records.map(r => r.sleepTime));
  const avgWakeTime = avgTime(records.map(r => r.wakeTime), true); // ✅ xử lý thời gian qua đêm


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
