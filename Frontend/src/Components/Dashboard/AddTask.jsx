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
export const AddTask = ({ tasks, setTasks }) => {
  // const [value, setValue] =
  //   (React.useState < Dayjs) | (null > dayjs("2022-04-17T15:30"));
  // const [selectedValue, setSelectedValue] = useState("");
  const [task_name, setTaskName] = useState("");
  const [task_description, setTaskDescription] = useState("");
  const [task_deadline, setTaskDeadline] = useState("");
  const [task_priority, setTaskPriority] = useState("");
  const [task_status, setTaskStatus] = useState("");
  const [task_id, setTaskId] = useState("");
  const [task_created_at, setTaskCreatedAt] = useState("");

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
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
                placeholder="MM/DD/YYYY hh:mm AM"
                onChange={(newValue) =>
                  // console.log(newValue.format("YYYY-MM-DD HH:mm:ss"))
                  setTaskDeadline(newValue.format("YYYY-MM-DD HH:mm:ss"))
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
          setTasks([
            ...tasks,
            {
              task_name: task_name,
              task_description: task_description,
              task_deadline: task_deadline,
              task_priority: task_priority,
              task_status: "pending",
              // task_id: useId(),
              task_created_at: task_created_at,
            },
          ]);
        }}
      >
        Add
      </Button>
    </div>
  );
};
