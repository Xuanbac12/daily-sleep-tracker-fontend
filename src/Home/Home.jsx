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

import axios from "../utils/axiosInstance"; // cập nhật đúng đường dẫn


const Home = () => {
  const [open, setOpen] = useState(false);
  const [records, setRecords] = useState([]);
  const navigate = useNavigate();

  

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // Tính từ hôm nay lùi về 6 ngày
  
  const last7DaysRecords = records.filter((r) => {
    const recordDate = new Date(r.date);
    return recordDate >= sevenDaysAgo;
  }).sort((a, b) => new Date(a.date) - new Date(b.date)); // sắp xếp tăng dần
  
  // ✅ Thêm các state cho thời gian và ngày
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime1, setSelectedTime1] = useState("");
  const [selectedTime2, setSelectedTime2] = useState("");

  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  console.log("👤 [Home.jsx] Username từ localStorage:", username);

  // Lọc bản ghi theo tuần hiện tại (thứ 2 - chủ nhật)
 const getCurrentWeekRecords = (records) => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (Chủ nhật) -> 6 (Thứ 7)

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)); // Thứ 2

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Chủ nhật

  return records.filter((r) => {
    const d = new Date(r.date);
    return d >= startOfWeek && d <= endOfWeek;
  });
};

const thisWeekRecords = getCurrentWeekRecords(records);



  // ✅ Hàm xử lý thay đổi input
  const handleDateChange = (e) => setSelectedDate(e.target.value);
  const handleTimeChange1 = (e) => setSelectedTime1(e.target.value);
  const handleTimeChange2 = (e) => setSelectedTime2(e.target.value);

  const fetchSleepRecords = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/sleep/user/${userId}`);
      setRecords(res.data);
    } catch (err) {
      console.error("Lỗi lấy bản ghi ngủ:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // hoặc trang đăng nhập
    } else {
      fetchSleepRecords();
    }
  }, []);
  
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    // ✅ Sau khi thêm bản ghi thì làm mới dữ liệu
    fetchSleepRecords();
    setSelectedDate("");
    setSelectedTime1("");
    setSelectedTime2("");
  };

  // const chartData = last7DaysRecords.map((item) => ({
  //   uv: parseFloat(item.duration),
  //   amt: item.date,
  // }));

  const chartData = last7DaysRecords.map((item) => ({
    date: item.date, // 🟢 phải là "date"
    duration: parseFloat(item.duration), // 🟢 phải là "duration"
  }));
  

  const isNewUser = records.length === 0;

  return (
    <div className="main">
      <Navbar username={username}/>
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
          handleDateChange={handleDateChange}
          selectedTime1={selectedTime1}
          handleTimeChange1={handleTimeChange1}
          selectedTime2={selectedTime2}
          handleTimeChange2={handleTimeChange2}
          existingDates={records.map((r) => r.date)} 
        />

        {!isNewUser && (
          <>
          <div className="statistics">
            <div className="duration">
              <p className="sleep-title">Sleep Duration</p>
              <SleepChart data={chartData} />
            </div>

            <div className="stats">
              <p className="sleep-title">Sleep Stats</p>
              <SleepTable records={last7DaysRecords} />
            </div>
          
          </div>

<SleepAnalysis records={thisWeekRecords} />
</>
        )}
      </div>
    </div>
  );
};

export default Home;
