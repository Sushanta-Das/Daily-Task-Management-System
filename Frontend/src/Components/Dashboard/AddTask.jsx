import React from "react";
import { TextField, Button, Typography, ListItemIcon } from "@mui/material";
import { useState, useId } from "react";
import dayjs, { Dayjs } from "dayjs";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import LowPriorityIcon from "@mui/icons-material/ArrowDownward";
import MediumPriorityIcon from "@mui/icons-material/ArrowForward";
import HighPriorityIcon from "@mui/icons-material/ArrowUpward";
// Add a new task
export const AddTask = ({ tasks, setTasks, setOpen, user }) => {
  const validateForm = () => {
    if (task_name === "") {
      alert("Please enter a task name");
      return false;
    } else if (task_deadline === "") {
      alert("Please enter a deadline");
      return false;
    } else if (task_priority === "") {
      alert("Please enter a priority");
      return false;
    } else return true;
  };
  const [task_name, setTaskName] = useState("");
  const [task_description, setTaskDescription] = useState("");
  const [task_deadline, setTaskDeadline] = useState("");
  const [task_priority, setTaskPriority] = useState("");
  // const [task_status, setTaskStatus] = useState(useId());
  const [taskId, setTaskId] = useState(tasks.length);
  const [task_created_at, setTaskCreatedAt] = useState("");
  const [is_collaborative, setIsCollaborative] = useState(0);
  const [colaborators, setColaborators] = useState([]);
  const [colaboratorId, setColaboratorId] = useState("");
  const changeTaskId = () => {
    setTaskId(taskId + 1);
  };
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
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
  const createTask = async () => {
    if (!validateForm()) return;

    // changeTaskId();
    const taskData = {
      task_name: task_name,
      task_priority: task_priority,
      task_creator: user.user_id,
      task_comment: "",
      task_parent: null,
      task_end: task_deadline.format("YYYY-MM-DD HH:mm:ss"), // Format date to match your requirements
      user_password: user.user_password, // Assuming user password is available in props
      task_iscollaborative: is_collaborative,
    };

    console.log(taskData);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData), // Convert the task object to JSON string
      });

      // Check if the request was successful
      if (response.status === 201) {
        const newTask = await response.json(); // Get the response data
        // Update the state with the new task added
        let taskarray = newTask.return[0];
        console.log(taskarray);
        setTasks([...tasks, taskarray]);

        // POST http://127.0.0.1:8080/team_update          #   To give permission to editor by user==creator

        // DELETE  http://127.0.0.1:8080/team_update       #   To remove permission from editor by user==creator
        // {
        //     "task_id":1,
        //     "task_editor":"doremon",
        //     "user_id":"tamal123",
        //     "user_password":"tamal123"
        // }

        if (is_collaborative) {
          colaborators.map(async (colaborator) => {
            const teamData = {
              task_id: taskarray.task_id,
              task_editor: colaborator,
              user_id: user.user_id,
              user_password: user.user_password,
            };
            try {
              const response = await fetch(
                `${import.meta.env.VITE_API_URL}/team_update`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(teamData), // Convert the task object to JSON string
                }
              );
              if (response.status === 201) {
                console.log("collaborator added");
              } else {
                alert("Failed to add colaborator. Please try again.");
              }
            } catch (error) {
              console.error("Error adding colaborator:", error);
              alert("An error occurred while adding the colaborator.");
            }
          });
        }

        setOpen(false); // Close the form/modal after adding
      } else {
        alert("Failed to create task. Please try again.");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      alert("An error occurred while creating the task.");
    }
  };

  return (
    <div className="form-container">
      <TextField
        id="standard-basic"
        label="Title"
        variant="standard"
        sx={{ minWidth: "20vw" }}
        value={task_name}
        onChange={(e) => setTaskName(e.target.value)}
      />
      {/* <TextField id="standard-basic" label="Desciption" variant="standard" /> */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DateTimePicker", "DateTimePicker"]}>
          <DemoItem label="Deadline">
            <div className="dateTimeSize">
              <DateTimePicker
                onChange={(newValue) =>
                  // console.log(newValue.format("YYYY-MM-DD HH:mm:ss"))
                  setTaskDeadline(newValue)
                }
              />
            </div>
          </DemoItem>
        </DemoContainer>
      </LocalizationProvider>

      <div className="flex-row gap8px">
        <InputLabel id="select-label">Priority</InputLabel>
        <Select
          labelId="select-label"
          id="select"
          value={task_priority}
          label="Select an option"
          onChange={(e) => setTaskPriority(e.target.value)}
          displayEmpty
          sx={{ display: "flex" }}
        >
          {/* Default placeholder item */}
          <MenuItem value="">
            <em>Select</em>
          </MenuItem>
          <MenuItem value={"High"} sx={{ color: "red" }}>
            <div className="flex-row noGap">
              {getPriorityIcon("High")}
              <Typography sx={{ color: "red", margin: "0" }}>High</Typography>
            </div>
          </MenuItem>
          <MenuItem value={"Medium"} sx={{ color: "#fd7e14" }}>
            <div className="flex-row noGap">
              {getPriorityIcon("Medium")}
              <Typography sx={{ color: "#fd7e14" }}>Medium</Typography>
            </div>
          </MenuItem>
          <MenuItem value={"Low"} sx={{ color: "#28a745" }}>
            <div className="flex-row noGap">
              {getPriorityIcon("Low")}
              <Typography sx={{ color: "#28a745" }}>Low</Typography>
            </div>
          </MenuItem>
        </Select>
        <div>
          <div className="flex-row">
            <InputLabel id="demo-simple-select-label">Collaborative</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={is_collaborative}
              onChange={(e) => setIsCollaborative(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">
                <em>Select</em>
              </MenuItem>
              <MenuItem value={1}>Yes</MenuItem>
              <MenuItem value={0}>No</MenuItem>
            </Select>
          </div>
        </div>
      </div>
      {/* add colaborators  one by one textfield and add button by userid if it is colaborative show show userids on adding  */}
      <div>
        {is_collaborative ? (
          <>
            <TextField
              id="standard-basic"
              label="Enter Colaborator's User ID"
              variant="standard"
              sx={{ minWidth: "20vw", fontSize: "10px" }}
              value={colaboratorId}
              onChange={(e) => setColaboratorId(e.target.value)}
            />

            <Button
              variant="outlined"
              sx={{ marginTop: "1rem" }}
              onClick={() => {
                setColaborators([...colaborators, colaboratorId]);
                setColaboratorId("");
              }}
            >
              Add member
            </Button>
          </>
        ) : (
          <></>
        )}
      </div>

      <Button
        size="md"
        sx={{ marginTop: "1rem" }}
        variant="contained"
        color="success"
        onClick={() => {
          createTask();
        }}
      >
        Add
      </Button>
    </div>
  );
};
