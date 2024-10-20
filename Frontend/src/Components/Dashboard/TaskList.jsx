import * as React from "react";
import { useState, useEffect, useRef } from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  IconButton,
  Divider,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import CommentIcon from "@mui/icons-material/Comment";
import { EditTask } from "./edittask";
import { DeleteTask } from "./deleteTask";
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

  const handleDelete = () => {
    setOpenDelete(true);
    handleClose();
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
  const hangleStatusChange = (task_id, status) => {
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
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      }); // Convert the task object to JSON string
  };

  return (
    <List sx={{ width: "100%", maxWidth: 450, bgcolor: "background.paper" }}>
      {tasks.length > 0 &&
        tasks.map((task) => {
          const labelId = `checkbox-list-label-${task.task_id}`;

          return (
            <div key={task.task_id}>
              <div className="flex-row">
                <Typography
                  component="span"
                  variant="body2"
                  sx={{
                    color:
                      task.task_priority === "High"
                        ? "#dc3545" // Red for High
                        : task.task_priority === "Medium"
                          ? "#fd7e14" // Orange for Medium
                          : "#28a745", // Green for Low
                    fontWeight: "bold",
                    marginRight: "10px", // Space between label and ListItem
                  }}
                >
                  {task.task_priority} Priority
                </Typography>

                <ListItem
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="comments"
                      onClick={(e) => handleClick(e, task.task_id)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  }
                  disablePadding
                >
                  <ListItemText
                    variant="h4"
                    id={labelId}
                    primary={
                      <Typography
                        component="span"
                        variant="h6"
                        sx={{ color: "text.primary", display: "inline" }}
                      >
                        {task.task_name}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{ color: "text.secondary", display: "inline" }}
                        >
                          due {task.task_end}
                        </Typography>

                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                          {/* <InputLabel id="demo-select-small-label">
                          Status
                        </InputLabel> */}
                          <Select
                            labelId="demo-select-small-label"
                            id="demo-select-small"
                            value={task.task_status}
                            onChange={(event) => {
                              hangleStatusChange(
                                task.task_id,
                                event.target.value
                              );
                            }}
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            <MenuItem
                              value={"Pending"}
                              sx={{ color: "#737373" }}
                            >
                              <Typography sx={{ color: "#737373" }}>
                                Pending
                              </Typography>
                            </MenuItem>
                            <MenuItem
                              sx={{ color: "#ff4000" }}
                              value={"Active"}
                            >
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
                      </>
                    }
                  />
                </ListItem>
              </div>
              <Divider />
              <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
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
                <MenuItem
                  onClick={() => {
                    handleEdit(task.task_id);
                  }}
                >
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
