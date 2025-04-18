import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const ConfirmDialog = ({ open, title, content, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{content}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="contained">Hủy</Button>
        <Button onClick={onConfirm} color="error" variant="contained">Xác nhận</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
