import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "../utils/axiosInstance"; // cập nhật đúng đường dẫn


const NewEntryDialog = ({
  open,
  handleClose,
  selectedDate,
  handleDateChange,
  selectedTime1,
  handleTimeChange1,
  selectedTime2,
  handleTimeChange2,
  existingDates = [] // ✅ Gán mặc định để tránh undefined
}) => {
  const [sleepDuration, setSleepDuration] = useState("");
  const [durationValue, setDurationValue] = useState(0);

  const formatDateToISO = (dateStr) => {
    const date = new Date(dateStr);
    return date.toISOString().split("T")[0]; // Trả về dạng yyyy-MM-dd
  };
  

  // ✅ Hàm tính thời gian ngủ (hiển thị + số thực)
  const calculateSleepDuration = (sleep, wake) => {
    if (!sleep || !wake) return { display: "", value: 0 };

    const [sleepH, sleepM] = sleep.split(":").map(Number);
    const [wakeH, wakeM] = wake.split(":").map(Number);

    let sleepTime = sleepH * 60 + sleepM;
    let wakeTime = wakeH * 60 + wakeM;

    if (wakeTime <= sleepTime) {
      wakeTime += 24 * 60;
    }

    const durationMins = wakeTime - sleepTime;
    const hours = Math.floor(durationMins / 60);
    const minutes = durationMins % 60;

    return {
      display: `${hours}h ${minutes}m`,
      value: parseFloat((durationMins / 60).toFixed(2)), // ví dụ: 7.5 giờ
    };
  };

  useEffect(() => {
    if (selectedTime1 && selectedTime2) {
      const result = calculateSleepDuration(selectedTime2, selectedTime1);
      setSleepDuration(result.display);
      setDurationValue(result.value);
    }
  }, [selectedTime1, selectedTime2]);

  const handleReset = () => {
    handleDateChange({ target: { value: "" } });
    handleTimeChange1({ target: { value: "" } });
    handleTimeChange2({ target: { value: "" } });
    setSleepDuration("");
    setDurationValue(0);
  };

  const handleSubmit = async () => {
    const userId = localStorage.getItem("userId");
  
    if (!userId || !selectedDate || !selectedTime1 || !selectedTime2) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
  
    const formattedDate = formatDateToISO(selectedDate);
    const formattedExistingDates = existingDates.map(d => formatDateToISO(d));
    // 🐞 THÊM CÁC LOG ĐỂ DEBUG
  console.log("✅ selectedDate:", selectedDate);
  console.log("✅ formattedDate:", formattedDate);
  console.log("✅ existingDates (gốc):", existingDates);
  console.log("✅ formattedExistingDates:", formattedExistingDates);
  console.log("📌 Check includes:", formattedExistingDates.includes(formattedDate));

    
    if (formattedExistingDates.includes(formattedDate)) {
      alert("Bạn đã có bản ghi cho ngày này rồi!");
      return;
    }
    
  
    const payload = {
      date: formattedDate,
      sleepTime: selectedTime2,
      wakeTime: selectedTime1,
      duration: durationValue,
      user: { id: userId },
    };
  
    try {
      const res = await axios.post("http://localhost:8080/api/sleep/add", payload);
    
      if (res.status === 200) {
        alert("Thêm bản ghi thành công!");
        handleClose();
      } else {
        alert("Gửi bản ghi thất bại. Mã phản hồi: " + res.status);
      }
    } catch (err) {
      console.error("Lỗi khi gửi bản ghi:", err);
      if (err.response) {
        console.log("⚠️ Status:", err.response.status);
        console.log("⚠️ Response body:", err.response.data);
        alert("Lỗi từ server: " + JSON.stringify(err.response.data));
      } else if (err.request) {
        console.log("⚠️ Không nhận được phản hồi từ server:", err.request);
        alert("Không thể kết nối đến server.");
      } else {
        alert("Lỗi không xác định: " + err.message);
      }
    }
  }
  
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <strong>Thêm bản ghi mới</strong>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 8, color: "gray" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="input-group">
            <label>Ngày</label>
            <input
              type="date"
              className="input"
              value={selectedDate}
              onChange={handleDateChange}
            />
          </div>

          <div className="input-group">
            <label>Giờ đi ngủ</label>
            <input
              type="time"
              className="input"
              value={selectedTime2}
              onChange={handleTimeChange2}
            />
          </div>

          <div className="input-group">
            <label>Giờ thức dậy</label>
            <input
              type="time"
              className="input"
              value={selectedTime1}
              onChange={handleTimeChange1}
            />
          </div>

          {sleepDuration && (
            <div style={{ marginTop: "10px", fontWeight: "bold" }}>
              💤 Tổng thời gian ngủ: {sleepDuration}
            </div>
          )}
        </LocalizationProvider>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between", padding: "10px 24px" }}>
        <Button variant="outlined" color="secondary" onClick={handleReset}>
          Đặt lại
        </Button>
        <Button variant="text" onClick={handleClose}>
          Hủy
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Gửi
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewEntryDialog;
