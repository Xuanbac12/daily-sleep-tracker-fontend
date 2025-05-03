import React, { useState } from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import axios from "../utils/axiosInstance";
import EditEntryDialog from "./EditEntryDialog";
import "./SleepTable.css";
import ConfirmDialog from "./ConfirmDialog"; // 👉 Thêm dòng này


dayjs.extend(isoWeek);

const SleepTable = ({ records, setRecords }) => {
  const [editRecord, setEditRecord] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false); // ✅ Dialog xác nhận
  const [deleteId, setDeleteId] = useState(null);         // ✅ Id đang chờ xác nhận


  // const startOfWeek = dayjs().startOf("isoWeek");
  // const endOfWeek = dayjs().endOf("isoWeek");

  // const filteredRecords = records.filter((r) => {
  //   const date = dayjs(r.date);
  //   return date.isAfter(startOfWeek.subtract(1, "day")) && date.isBefore(endOfWeek.add(1, "day"));
  // });

  //const totalSleep = filteredRecords.reduce((sum, r) => sum + parseFloat(r.duration), 0);

  const handleEdit = (id) => {
    const record = records.find((r) => r.id === id);
    setEditRecord(record);
    setEditOpen(true);
  };

  const handleSaveEdit = async (data) => {
    try {
      const res = await axios.put(`/sleep/${data.id}`, {
        sleepTime: data.sleepTime,
        wakeTime: data.wakeTime,
      });
  
      const updatedRecord = res.data;
  
      const newRecords = records.map((r) =>
        r.id === updatedRecord.id ? updatedRecord : r
      );
  
      console.log("✅ setRecords với dữ liệu mới:", newRecords);
      setRecords([...newRecords]);  // 🟢 Spread để chắc chắn tạo mảng mới
  
      setEditOpen(false); // ✅ đóng dialog sau khi cập nhật
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật:", err);
    }
  };
  

  const handleDeleteRequest = (id) => {
    setDeleteId(id);        // 👉 Lưu id muốn xóa
    setConfirmOpen(true);   // 👉 Mở dialog
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`/sleep/${deleteId}`);
      setRecords(records.filter((r) => r.id !== deleteId));
    } catch (err) {
      console.error("❌ Lỗi khi xóa:", err);
    } finally {
      setConfirmOpen(false); // ✅ Đóng dialog
      setDeleteId(null);
    }
  };


  return (
    <div className="sleep-table-container">
      <h2 className="section-title">Sleep Stats (This Week)</h2>
     <div className="table-wrapper">
      <table className="styled-table">
        <thead>
          <tr>
            <th>Ngày</th>
            <th>Giờ đi ngủ</th>
            <th>Giờ thức dậy</th>
            <th>Thời lượng</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
        {[...records]
  .sort((a, b) => new Date(a.date) - new Date(b.date))
  .map((record) => (

            <tr key={record.id}>
              <td>{dayjs(record.date).format("DD/MM/YYYY")}</td> {/* 👉 Định dạng ngày */}
              <td>{record.sleepTime}</td>
              <td>{record.wakeTime}</td>
              <td>{record.duration} giờ</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(record.id)}>Sửa</button>
                <button className="delete-btn" onClick={() => handleDeleteRequest(record.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      {/* ✅ Dialog sửa */}
      {editRecord && (
        <EditEntryDialog
          open={editOpen}
          onClose={() => setEditOpen(false)}
          record={editRecord}
          onSave={handleSaveEdit}
        />
      )}

      {/* 🔁 Dialog xác nhận xóa */}
      <ConfirmDialog
        open={confirmOpen}
        title="Xác nhận xóa"
        content="Bạn có chắc chắn muốn xóa bản ghi này không?"
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default SleepTable;
