import React, { useEffect } from "react";
import { TextField, Button } from "@mui/material";
import { useState, useId } from "react";
import dayjs, { Dayjs } from "dayjs";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

// import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
// import { TimePicker } from "@mui/lab";
export const EditForm = ({ taskId, tasks, setTasks, user }) => {
  const [taskName, setTaskName] = useState("");
  const [taskDeadline, setTaskDeadline] = useState(null);
  const [taskPriority, setTaskPriority] = useState("");
  const [taskStatus, setTaskStatus] = useState("");
  const [taskCreatedAt, setTaskCreatedAt] = useState("");
  useEffect(() => {
    const task = tasks.find((task) => task.task_id === taskId);
    setTaskName(task.task_name);
    setTaskDeadline(dayjs(task.task_end));
    setTaskPriority(task.task_priority);
    setTaskStatus(task.task_status);
  }, []);
  const validateForm = () => {
    if (taskName === "") {
      alert("Please enter a task name");
      return false;
    } else if (taskDeadline === null) {
      alert("Please enter a deadline");
      return false;
    } else if (taskPriority === "") {
      alert("Please enter a priority");
      return false;
    } else return true;
  };
  const updateTask = async () => {
    if (!validateForm()) return;
    // Use map to create a new array with the updated object
    const taskData = {
      task_id: taskId,
      task_name: taskName,
      task_priority: taskPriority,

      task_comment: "",
      task_parent: null,
      task_end: taskDeadline.format("YYYY-MM-DD HH:mm:ss"), // Format date to match your requirements
      user_password: user.user_password, // Assuming user password is available in props
    };

    console.log(taskData);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/task`, {
        method: "PUT",
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

        const updatedTasks = tasks.map((task) => {
          if (task.task_id === taskId) {
            // Create a new object with the updated name
            return {
              ...task,
              task_name: taskName,
              task_end: taskDeadline.format("YYYY-MM-DD HH:mm:ss"),
              task_priority: taskPriority,
            };
          }
          // Return the object as is if no update is needed
          return task;
        });

        // Update the state with the new array
        setTasks(updatedTasks);
      } else {
        alert("Failed to edit task. Please try again.");
      }
    } catch (error) {
      console.error("Error editing task:", error);
      alert("An error occurred while editing the task.");
    }
  };

  return (
    <div className="form-container">
      <TextField
        id="standard-basic"
        label="Title"
        variant="standard"
        sx={{ minWidth: "20vw" }}
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
      />
      {/* <TextField id="standard-basic" label="Desciption" variant="standard" /> */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DateTimePicker", "DateTimePicker"]}>
          <DemoItem label="Deadline">
            <div className="dateTimeSize">
              <DateTimePicker
                // placeholder="MM/DD/YYYY hh:mm AM"
                value={taskDeadline}
                onChange={(newValue) =>
                  // console.log(newValue.format("YYYY-MM-DD HH:mm:ss"))
                  setTaskDeadline(newValue)
                }
              />
            </div>
          </DemoItem>
        </DemoContainer>
      </LocalizationProvider>

      <div className="flex-row">
        <InputLabel id="select-label">Priority</InputLabel>
        <Select
          labelId="select-label"
          id="select"
          value={taskPriority}
          label="Select an option"
          onChange={(e) => setTaskPriority(e.target.value)}
          displayEmpty
        >
          {/* Default placeholder item */}
          <MenuItem value="">
            <em>Select</em>
          </MenuItem>
          <MenuItem value={"High"}>High</MenuItem>
          <MenuItem value={"Medium"}>Medium</MenuItem>
          <MenuItem value={"Low"}>Low</MenuItem>
        </Select>
      </div>
      <Button
        size="md"
        variant="contained"
        color="success"
        onClick={() => {
          updateTask();
        }}
      >
        Edit
      </Button>
    </div>
  );
};
