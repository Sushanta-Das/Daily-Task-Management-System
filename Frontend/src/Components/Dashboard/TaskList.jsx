import * as React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect, useRef } from "react";
import {
  Typography,
  List,
  ListItem,
  IconButton,
  Divider,
  Menu,
  MenuItem,
  FormControl,
  Select,
  ListItemIcon,
  Grid,
} from "@mui/material";
import LowPriorityIcon from "@mui/icons-material/ArrowDownward";
import MediumPriorityIcon from "@mui/icons-material/ArrowForward";
import HighPriorityIcon from "@mui/icons-material/ArrowUpward";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CommentIcon from "@mui/icons-material/Comment";
import { EditTask } from "./edittask";
import { DeleteTask } from "./deleteTask";

// Shows list of tasks
export default function TaskList({ tasks, setTasks, user }) {
  const firstUpdate = useRef(true);
  const handleClick = (event, task_id) => {
    setAnchorEl(event.currentTarget);
    setTaskId(task_id);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleEdit = (task_id) => {
    console.log(task_id + "in tasklist");
    setOpenEdit(true);
    handleClose();
  };
  const showSuggestions = async () => {
    // GET http://127.0.0.1:8080/suggestion
    //fetch suggestions from backend
    const response = await fetch("http://localhost:8080/suggestion", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data.return);

    toast.success(data.return, {
      position: "top-right", // Customize position
      autoClose: 5000, // Close after 5 seconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleDelete = () => {
    setOpenDelete(true);
    handleClose();
  };
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "High":
        return <HighPriorityIcon sx={{ color: "#dc3545" }} />; // Red for High
      case "Medium":
        return <MediumPriorityIcon sx={{ color: "#fd7e14" }} />; // Orange for Medium
      case "Low":
      default:
        return <LowPriorityIcon sx={{ color: "#28a745" }} />; // Green for Low
    }
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [checked, setChecked] = useState([0]);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  // const [taskStatus, setTaskStatus] = useState();
  const [taskId, setTaskId] = useState(-1);
  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };
  const handleStatusChange = (task_id, status) => {
    console.log(task_id, status);

    const newTasks = tasks.map((task) => {
      if (task.task_id === task_id) {
        task.task_status = status;
      }
      return task;
    });
    setTasks(newTasks);
    //     PUT http://127.0.0.1:8080/status_comment        # update by editor/creator

    // {                                               # all fields are mandatory in case of update
    //     "task_id":6,
    //     "user_id":"doremon",
    //     "user_password":"1234567890",
    //     "task_status":"Done",
    //     "task_comment":"Helicopter"
    // }

    const taskData = {
      task_id: task_id,
      user_id: user.user_id,
      user_password: user.user_password,
      task_status: status,
      task_comment: "",
    };
    console.log(taskData);
    fetch("http://localhost:8080/status_comment", {
      // Replace with actual endpoint
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    })
      .then((res) => {
        if (res.status === 200 && status === "Done") {
          console.log("Status updated successfully");
          showSuggestions();
        }
        res.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      }); // Convert the task object to JSON string
  };

  return (
    <List
      sx={{
        width: "100%",
        bgcolor: "background.paper",
        maxWidth: "800px",
      }}
    >
      {tasks.length > 0 &&
        tasks.map((task) => {
          const labelId = `checkbox-list-label-${task.task_id}`;

          return (
            <div key={task.task_id}>
              <div className="flex-row noGap">
                <ListItem alignItems="flex-start" disablePadding>
                  <ListItemIcon>
                    {getPriorityIcon(task.task_priority)}
                  </ListItemIcon>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={8}>
                      <Typography
                        variant="h6"
                        sx={{
                          wordWrap: "break-word",
                          whiteSpace: "normal", // allow text to wrap
                          maxWidth: "100%",
                        }}
                      >
                        {task.task_name}
                      </Typography>
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        due {task.task_end}
                      </Typography>
                    </Grid>

                    <Grid item xs={4} container justifyContent="flex-end">
                      <FormControl sx={{ m: 1 }} size="small">
                        <Select
                          value={task.task_status}
                          onChange={(event) =>
                            handleStatusChange(task.task_id, event.target.value)
                          }
                        >
                          <MenuItem value={"Pending"} sx={{ color: "#737373" }}>
                            <Typography sx={{ color: "#737373" }}>
                              Pending
                            </Typography>
                          </MenuItem>
                          <MenuItem sx={{ color: "#ff4000" }} value={"Active"}>
                            <Typography sx={{ color: "#ff4000" }}>
                              Active
                            </Typography>
                          </MenuItem>
                          <MenuItem sx={{ color: "#28a745" }} value={"Done"}>
                            <Typography sx={{ color: "#28a745" }}>
                              Done
                            </Typography>
                          </MenuItem>
                        </Select>
                      </FormControl>

                      <IconButton
                        edge="end"
                        aria-label="More"
                        onClick={(e) => handleClick(e, task.task_id)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </ListItem>
              </div>
              <Divider />
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <MenuItem onClick={() => handleEdit(task.task_id)}>
                  Edit Task
                </MenuItem>
                <MenuItem onClick={handleClose}>Add subtask</MenuItem>
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
              </Menu>
            </div>
          );
        })}

      <EditTask
        openEdit={openEdit}
        setOpenEdit={setOpenEdit}
        taskId={taskId}
        tasks={tasks}
        setTasks={setTasks}
        user={user}
      />
      <DeleteTask
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
        taskId={taskId}
        user={user}
        tasks={tasks}
        setTasks={setTasks}
      />
    </List>
  );
}
