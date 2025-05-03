import React, { useState, useEffect } from "react";
import "./Home.css";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import NewEntryDialog from "./NewEntryDialog";
import SleepChart from "./SleepChart";
import SleepTable from "./SleepTable";
import Navbar from "../Navbar/Navbar";
import SleepAnalysis from "../SleepAnalysis/SleepAnalysis";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import WeekSelector from "./WeekSelector"; // 👉 Đã thêm bộ chọn tuần

dayjs.extend(isoWeek);

const Home = () => {
  const [open, setOpen] = useState(false);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedWeek, setSelectedWeek] = useState({
    start: dayjs().startOf("isoWeek"),
    end: dayjs().endOf("isoWeek"),
  });

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime1, setSelectedTime1] = useState("");
  const [selectedTime2, setSelectedTime2] = useState("");

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");

  const fetchSleepRecords = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await axios.get("/sleep/week", {
        params: {
          userId,
          start: selectedWeek.start.format("YYYY-MM-DD"),
          end: selectedWeek.end.format("YYYY-MM-DD"),
        },
      });
      setRecords(res.data);
    } catch (err) {
      console.error("❌ Lỗi khi fetch dữ liệu ngủ:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Khi đăng nhập hoặc đổi tuần thì gọi API
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      fetchSleepRecords();
    }
  }, [selectedWeek]);

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    fetchSleepRecords(); // Làm mới dữ liệu sau khi thêm
    setSelectedDate("");
    setSelectedTime1("");
    setSelectedTime2("");
  };

  const chartData = records.map((item) => ({
    date: item.date,
    duration: parseFloat(item.duration),
  }));

  const isNewUser = !loading && records.length === 0;

  return (
    <div className="main">
      <Navbar username={username} />
      <div className="container">
      <div className="header-section">
  <p className="title">Daily Sleep Tracker</p>

  <div className="filters">
    <WeekSelector onWeekChange={setSelectedWeek} />
  </div>

  <div className="add-btn">
    <Button
      variant="contained"
      className="new-btn1"
      startIcon={<AddIcon />}
      onClick={handleClickOpen}
    >
      New Entry
    </Button>
  </div>
</div>


        <NewEntryDialog
          open={open}
          handleClose={handleClose}
          selectedDate={selectedDate}
          handleDateChange={(e) => setSelectedDate(e.target.value)}
          selectedTime1={selectedTime1}
          handleTimeChange1={(e) => setSelectedTime1(e.target.value)}
          selectedTime2={selectedTime2}
          handleTimeChange2={(e) => setSelectedTime2(e.target.value)}
          existingDates={records.map((r) => r.date)}
        />

        {loading ? (
          <p>Loading sleep records...</p>
        ) : isNewUser ? (
          <p className="sleep-title">No sleep records yet. Please add your first entry!</p>
        ) : (
          <>
            <div className="statistics">
              <div className="stats">
                <SleepTable records={records} setRecords={setRecords} />
              </div>

              <div className="duration">
                <p className="sleep-title">Sleep Duration</p>
                <SleepChart data={records} />
              </div>
            </div>

            <SleepAnalysis records={records} />
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
