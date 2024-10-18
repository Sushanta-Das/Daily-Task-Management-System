import React from "react";
import { Button, Box, Typography } from "@mui/material";
import Add from "@mui/icons-material/Add";
import { Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { AddTask } from "./AddTask";
import { EditForm } from "./editForm";
export const EditTask = ({
  taskId,
  tasks,
  setTasks,
  openEdit,
  setOpenEdit,
}) => {
  console.log("taskID", taskId);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    // border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  return (
    <div>
      {" "}
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* <AddTask tasks={tasks} setTasks={setTasks} /> */}
        <Box sx={style}>
          <Button
            onClick={() => setOpenEdit(false)}
            startIcon={<CloseIcon />}
            sx={{ float: "right" }}
          />
          <Typography id="modal-title" variant="h6" component="h2">
            Edit Task
          </Typography>

          <EditForm taskId={taskId} tasks={tasks} setTasks={setTasks} />
        </Box>
      </Modal>
    </div>
  );
};
