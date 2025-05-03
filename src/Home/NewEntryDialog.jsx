import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, IconButton, TextField
} from "@mui/material";
import { LocalizationProvider, DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CloseIcon from "@mui/icons-material/Close";
import axios from "../utils/axiosInstance";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import {Box} from "@mui/material";
import 'dayjs/locale/vi'; // thêm dòng này vào đầu file
dayjs.locale('vi');

const NewEntryDialog = ({ open, handleClose, existingDates = [] }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [sleepTime, setSleepTime] = useState(null);
  const [wakeTime, setWakeTime] = useState(null);
  const [sleepDuration, setSleepDuration] = useState("");
  const [durationValue, setDurationValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ date: "", sleep: "", wake: "" });

  useEffect(() => {
    if (selectedDate && sleepTime && wakeTime) {
      const sleep = selectedDate.hour(sleepTime.hour()).minute(sleepTime.minute());
      const wake = selectedDate.hour(wakeTime.hour()).minute(wakeTime.minute());
      let diff = wake.diff(sleep, "minute");
      if (diff < 0) diff += 24 * 60;
      const hours = Math.floor(diff / 60);
      const minutes = diff % 60;
      setSleepDuration(`${hours}h ${minutes}m`);
      setDurationValue((diff / 60).toFixed(2));
    } else {
      setSleepDuration("");
      setDurationValue(0);
    }
  }, [selectedDate, sleepTime, wakeTime]);

  // Kiểm tra xem ngày đã tồn tại hay chưa
useEffect(() => {
  if (selectedDate) {
    const formattedDate = selectedDate.format("YYYY-MM-DD");
    if (!existingDates.includes(formattedDate)) {
      setErrors(prev => ({ ...prev, date: "" }));
    }
  }
}, [selectedDate, existingDates]);

  const handleReset = () => {
    setSelectedDate(null);
    setSleepTime(null);
    setWakeTime(null);
    setSleepDuration("");
    setDurationValue(0);
    setErrors({ date: "", sleep: "", wake: "" });
  };

  const handleSubmit = async () => {
    const newErrors = { date: "", sleep: "", wake: "" };
    let hasError = false;

    if (!selectedDate) {
      newErrors.date = "Vui lòng chọn ngày.";
      hasError = true;
    } else if (selectedDate.isAfter(dayjs(), 'day')) {
      newErrors.date = "Không được chọn ngày trong tương lai.";
      hasError = true;
    }

    if (!sleepTime) {
      newErrors.sleep = "Vui lòng chọn giờ đi ngủ.";
      hasError = true;
    }

    if (!wakeTime) {
      newErrors.wake = "Vui lòng chọn giờ thức dậy.";
      hasError = true;
    }

    const formattedDate = selectedDate?.format("YYYY-MM-DD");
    if (existingDates.includes(formattedDate)) {
      newErrors.date = "Bạn đã có bản ghi cho ngày này.";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    const minSleepHours = 1;
    const maxSleepHours = 10;
    
    if (parseFloat(durationValue) < minSleepHours) {
      toast.error(`Không thể ngủ ít hơn ${minSleepHours} giờ.`);
      return;
    }
    
    if (parseFloat(durationValue) > maxSleepHours) {
      toast.error(`Không thể ngủ liên tục hơn ${maxSleepHours} giờ.`);
      return;
    }
    


    const userId = localStorage.getItem("userId");
    const payload = {
      date: formattedDate,
      sleepTime: sleepTime.format("HH:mm"),
      wakeTime: wakeTime.format("HH:mm"),
      duration: durationValue,
      user: { id: userId },
    };

    try {
      setLoading(true);
      const res = await axios.post("/sleep/add", payload);
      if (res.status === 200) {
        toast.success("Thêm bản ghi thành công!");
        handleReset();
        handleClose();
      } else {
        toast.error("Thêm thất bại.");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Lỗi hệ thống.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => { handleClose(); handleReset(); }} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ p: 0 }}>
  <Box
    sx={{
      textAlign: "center",
      py: 2,
      fontSize: "1.25rem", // Tăng cỡ chữ
      fontWeight: "bold",  // In đậm
      fontFamily: "Roboto, sans-serif", // Chọn font đẹp hơn
      letterSpacing: "0.5px", // Giãn chữ nhẹ
      color: "#333" // Màu đậm hơn
    }}
  >
    Thêm bản ghi mới
  </Box>

  <IconButton
    onClick={() => { handleClose(); handleReset(); }}
    sx={{ position: "absolute", right: 8, top: 8 }}
  >
    <CloseIcon />
  </IconButton>
</DialogTitle>



      <DialogContent dividers>
        <LocalizationProvider 
        dateAdapter={AdapterDayjs}
        adapterLocale="vi" // Đặt ngôn ngữ tiếng Việt cho DatePicker
        >
          <div style={{ marginBottom: 16 }}>
           <DatePicker
              label="Ngày"
              value={selectedDate}
              onChange={setSelectedDate}
              disableFuture
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.date,
                  helperText: errors.date,
                },
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <TimePicker
              label="Giờ đi ngủ"
              value={sleepTime}
              onChange={setSleepTime}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.sleep,
                  helperText: errors.sleep,
                },
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <TimePicker
              label="Giờ thức dậy"
              value={wakeTime}
              onChange={setWakeTime}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.wake,
                  helperText: errors.wake,
                },
              }}
            />
          </div>

          {sleepDuration && (
            <p><strong>📅 Tổng thời gian ngủ: {sleepDuration}</strong></p>
          )}
        </LocalizationProvider>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between", px: 3 }}>
        <Button onClick={handleReset} color="secondary" variant="contained">Đặt lại</Button>
        <Button onClick={() => { handleClose(); handleReset(); }} color="error" variant="contained">Hủy</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? "Đang gửi..." : "Gửi"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewEntryDialog;