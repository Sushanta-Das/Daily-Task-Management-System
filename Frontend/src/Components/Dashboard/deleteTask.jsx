import React from "react";
import { Button, Box, Typography } from "@mui/material";
import Add from "@mui/icons-material/Add";
import { Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { AddTask } from "./AddTask";
import { EditForm } from "./editForm";
export const DeleteTask = ({
  openDelete,
  setOpenDelete,
  taskId,
  tasks,
  setTasks,
}) => {
  const handleDeleteTask = () => {
    const updatedTasks = tasks.filter((task) => task.task_id !== taskId);
    setTasks(updatedTasks);
    setOpenDelete(false);
  };

  //   console.log("taskID", taskId);
  const style = {
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    gap: "1vh",
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
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* <AddTask tasks={tasks} setTasks={setTasks} /> */}

        <Box sx={style}>
          <Box>
            {" "}
            <Button
              onClick={() => setOpenDelete(false)}
              startIcon={<CloseIcon />}
              sx={{ float: "right" }}
            />{" "}
            <Typography id="modal-title" variant="h6" component="h2">
              Are you sure you want to delete this task?
            </Typography>
          </Box>

          <Button color="error" variant="contained" onClick={handleDeleteTask}>
            Delete
          </Button>
        </Box>
      </Modal>
    </div>
  );
};
