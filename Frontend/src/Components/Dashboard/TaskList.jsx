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

  return (
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      {tasks.length > 0 &&
        tasks.map((task) => {
          const labelId = `checkbox-list-label-${task.task_id}`;

          return (
            <div key={task.task_id}>
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
                        sx={{ color: "text.primary", display: "inline" }}
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
                          // value={}

                          // onChange={handleChange}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value={10}>
                            {" "}
                            <Typography
                              // component="span"
                              variant="body1"
                              color="success"
                              sx={{ display: "inline" }}
                            >
                              Pending
                            </Typography>
                          </MenuItem>
                          <MenuItem value={20}>Active</MenuItem>
                          <MenuItem value={30}>Completd</MenuItem>
                        </Select>
                      </FormControl>
                    </>
                  }
                />
              </ListItem>
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
                <MenuItem onClick={handleClose}>My account</MenuItem>
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
