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

const Home = () => {
  const [open, setOpen] = useState(false);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime1, setSelectedTime1] = useState("");
  const [selectedTime2, setSelectedTime2] = useState("");

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");

  // 📅 Lọc 7 ngày gần nhất
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  const last7DaysRecords = records
    .filter((r) => new Date(r.date) >= sevenDaysAgo)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // 📅 Lọc theo tuần hiện tại (Thứ 2 - Chủ nhật)
  const getCurrentWeekRecords = (records) => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Chủ nhật
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return records.filter((r) => {
      const d = new Date(r.date);
      return d >= startOfWeek && d <= endOfWeek;
    });
  };

  const thisWeekRecords = getCurrentWeekRecords(records);

  const fetchSleepRecords = async () => {
    try {
      const res = await axios.get(`/sleep/user/${userId}`);
      console.log("📥 Sleep data:", res.data);
      setRecords(res.data);
    } catch (err) {
      console.error("❌ Lỗi khi fetch dữ liệu ngủ:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      fetchSleepRecords();
    }
  }, []);

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    fetchSleepRecords(); // Làm mới dữ liệu
    setSelectedDate("");
    setSelectedTime1("");
    setSelectedTime2("");
  };

  const chartData = last7DaysRecords.map((item) => ({
    date: item.date,
    duration: parseFloat(item.duration),
  }));

  const isNewUser = !loading && records.length === 0;

  return (
    <div className="main">
      <Navbar username={username} />
      <div className="container">
        <p className="title">Daily Sleep Tracker</p>

        <div className="add-btn">
          <Button
            variant="contained"
            className="new-btn1"
            startIcon={<AddIcon />}
            onClick={handleClickOpen}
            sx={{ backgroundColor: "#5795FA", borderRadius: 50 }}
          >
            New Entry
          </Button>
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
              <div className="duration">
                <p className="sleep-title">Sleep Duration (Last 7 Days)</p>
                <SleepChart data={chartData} />
              </div>

              <div className="stats">
                <p className="sleep-title">Sleep Stats</p>
                <SleepTable records={last7DaysRecords} />
              </div>
            </div>

            <SleepAnalysis records={thisWeekRecords} />

            {/* Biểu đồ thêm (tuần hiện tại) */}
            <SleepChart
              data={thisWeekRecords.map((item) => ({
                date: item.date,
                duration: parseFloat(item.duration),
              }))}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
