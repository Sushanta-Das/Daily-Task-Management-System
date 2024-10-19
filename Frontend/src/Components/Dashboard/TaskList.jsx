import * as React from "react";
import { useState, useEffect, useRef } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import CommentIcon from "@mui/icons-material/Comment";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
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
                    <CommentIcon />
                  </IconButton>
                }
                disablePadding
              >
                <ListItemText id={labelId} primary={` ${task.task_name}`} />
                {task.task_end}
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
