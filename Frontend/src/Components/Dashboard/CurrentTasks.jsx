import React from "react";
import { AddTask } from "./AddTask";
import { Tasks } from "./Tasks";
import { Button, Box, Typography } from "@mui/material";
import Add from "@mui/icons-material/Add";
import { Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TaskList from "./TaskList";
export const CurrentTasks = ({ tasks, setTasks, user }) => {
  const [open, setOpen] = React.useState(false);
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
    console.log(tasks),
    (
      <div>
        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          startIcon={<Add />}
        >
          Add Task
        </Button>
        <Modal
          aria-labelledby="modal-title"
          aria-describedby="modal-desc"
          open={open}
          onClose={() => setOpen(false)}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* <AddTask tasks={tasks} setTasks={setTasks} /> */}
          <Box sx={style}>
            <Button
              onClick={() => setOpen(false)}
              startIcon={<CloseIcon />}
              sx={{ float: "right" }}
            />
            <Typography id="modal-title" variant="h6" component="h2">
              Add Task
            </Typography>

            <AddTask
              tasks={tasks}
              setTasks={setTasks}
              setOpen={setOpen}
              user={user}
            />
          </Box>
        </Modal>
        <Typography id="modal-title" variant="h7" component="h2">
          All Tasks ({tasks.length})
        </Typography>

        <TaskList tasks={tasks} setTasks={setTasks} user={user} />
      </div>
    )
  );
};
