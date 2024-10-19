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
  user,
}) => {
  const handleDeleteTask = async () => {
    const taskData = {
      user_id: user.user_id,
      user_password: user.user_password,
      task_id: taskId,
    };
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/task`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData), // Convert the task object to JSON string
      });

      // Check if the request was successful
      if (response.status === 200) {
        // const newTask = await response.json(); // Get the response data
        // // Update the state with the new task added
        // let taskarray = newTask.return[0];
        // console.log(taskarray);
        // setTasks([...tasks, taskarray]);

        const updatedTasks = tasks.filter((task) => task.task_id !== taskId);
        setTasks(updatedTasks);
        setOpenDelete(false);
      } else {
        alert("Failed to edit task. Please try again.");
      }
    } catch (error) {
      console.error("Error editing task:", error);
      alert("An error occurred while editing the task.");
    }
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
