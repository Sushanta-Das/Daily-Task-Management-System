import React from "react";
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
export const AddTask = ({ tasks, setTasks, setOpen, user }) => {
  // const [value, setValue] =
  //   (React.useState < Dayjs) | (null > dayjs("2022-04-17T15:30"));
  // const [selectedValue, setSelectedValue] = useState("");

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
  const [task_status, setTaskStatus] = useState(useId());
  const [taskId, setTaskId] = useState(tasks.length);
  const [task_created_at, setTaskCreatedAt] = useState("");
  const changeTaskId = () => {
    setTaskId(taskId + 1);
  };
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
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

      <div className="flex-row">
        <InputLabel id="select-label">Priority</InputLabel>
        <Select
          labelId="select-label"
          id="select"
          value={task_priority}
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
          createTask();
        }}
      >
        Add
      </Button>
    </div>
  );
};
