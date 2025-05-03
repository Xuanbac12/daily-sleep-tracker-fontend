import React, { useEffect, useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/vi"; // ✅ Import locale tiếng Việt

dayjs.locale("vi");       // ✅ Đặt ngôn ngữ mặc định là tiếng Việt

const WeekSelector = ({ onWeekChange }) => {
  const [month, setMonth] = useState(dayjs());
  const [weeks, setWeeks] = useState([]);
  const [weekIndex, setWeekIndex] = useState(0);

  useEffect(() => {
    const w = [];
    let current = month.startOf("month").startOf("week");
    const end = month.endOf("month").endOf("week");

    while (current.isBefore(end)) {
      w.push({ start: current, end: current.endOf("week") });
      current = current.add(1, "week");
    }

    setWeeks(w);
    setWeekIndex(0);
  }, [month]);

  useEffect(() => {
    if (weeks.length > 0 && onWeekChange) {
      onWeekChange(weeks[weekIndex]);
    }
  }, [weekIndex, weeks]);

  return (
    <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
        <DatePicker
          label="Chọn tháng"
          views={["year", "month"]}
          value={month}
          onChange={(val) => setMonth(val)}
        />
      </LocalizationProvider>

      <select value={weekIndex} onChange={(e) => setWeekIndex(Number(e.target.value))}>
        {weeks.map((week, idx) => (
          <option key={idx} value={idx}>
            Tuần {idx + 1}: {week.start.format("DD/MM")} - {week.end.format("DD/MM")}
          </option>
        ))}
      </select>
    </div>
  );
};

export default WeekSelector;
