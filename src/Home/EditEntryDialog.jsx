import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField
} from "@mui/material";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { toast } from "react-toastify";

const EditEntryDialog = ({ open, onClose, record, onSave }) => {
  const [sleepTime, setSleepTime] = useState(null);
  const [wakeTime, setWakeTime] = useState(null);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (record) {
      setSleepTime(dayjs(`2023-01-01T${record.sleepTime}`));
      setWakeTime(dayjs(`2023-01-01T${record.wakeTime}`));
    }
  }, [record]);

  useEffect(() => {
    if (!sleepTime || !wakeTime) {
      setError("⛔ Vui lòng nhập đầy đủ giờ.");
      return;
    }

    let start = sleepTime;
    let end = wakeTime;

    if (end.isBefore(start)) {
      end = end.add(1, "day");
    }

    const diffMins = end.diff(start, "minute");
    const hours = Math.round((diffMins / 60) * 10) / 10;
    setDuration(hours);

    if (hours < 1) {
      setError("⛔ Ngủ dưới 1 giờ là không hợp lý.");
    } else if (hours > 10) {
      setError("⛔ Không được ngủ quá 10 giờ.");
    } else {
      setError("");
    }
  }, [sleepTime, wakeTime]);

  const handleSubmit = () => {
    if (error || !sleepTime || !wakeTime) {
      toast.error("Vui lòng kiểm tra thông tin hợp lệ.");
      return;
    }

    onSave({
      id: record.id,
      sleepTime: sleepTime.format("HH:mm"),
      wakeTime: wakeTime.format("HH:mm"),
      duration: duration,
    });

    toast.success("Cập nhật thành công!");
    onClose();
  };

  const handleReset = () => {
    if (record) {
      setSleepTime(dayjs(`2023-01-01T${record.sleepTime}`));
      setWakeTime(dayjs(`2023-01-01T${record.wakeTime}`));
      setError("");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
        ✏️ Chỉnh sửa bản ghi
      </DialogTitle>
      <DialogContent dividers>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TextField
            label="Ngày (không thay đổi)"
            fullWidth
            value={record?.date ? dayjs(record.date).format("DD/MM/YYYY") : ""}
            margin="dense"
            disabled
          />
          <TimePicker
            label="Giờ đi ngủ"
            value={sleepTime}
            onChange={setSleepTime}
            ampm = {false}
            slotProps={{
              textField: {
                fullWidth: true,
                margin: "dense",
              },
            }}
          />
          <TimePicker
            label="Giờ thức dậy"
            value={wakeTime}
            onChange={setWakeTime}
            ampm = {false}
            slotProps={{
              textField: {
                fullWidth: true,
                margin: "dense",
              },
            }}
          />
        </LocalizationProvider>

        <div style={{ marginTop: "10px", fontWeight: "bold" }}>
          😴 Tổng giờ ngủ: {duration} giờ
        </div>
        {error && (
          <div style={{ color: "red", marginTop: "8px", fontSize: "0.9rem" }}>
            {error}
          </div>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between", px: 3 }}>
        <Button onClick={handleReset} color="secondary" variant="contained">Đặt lại</Button>
        <Button onClick={onClose} color="error" variant="contained">Hủy</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!!error || !sleepTime || !wakeTime}>
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditEntryDialog;
