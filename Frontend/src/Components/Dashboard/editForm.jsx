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

//form to edit the task
export const EditForm = ({ taskId, tasks, setTasks, user, setOpenEdit }) => {
  const [taskName, setTaskName] = useState("");
  const [taskDeadline, setTaskDeadline] = useState(null);
  const [taskPriority, setTaskPriority] = useState("");
  const [taskStatus, setTaskStatus] = useState("");
  const [taskCreatedAt, setTaskCreatedAt] = useState("");
  const [is_collaborative, setIsCollaborative] = useState(0);
  const [colaborators, setColaborators] = useState([]);
  const [colaboratorId, setColaboratorId] = useState("");
  useEffect(() => {
    const task = tasks.find((task) => task.task_id === taskId);
    setTaskName(task.task_name);
    setTaskDeadline(dayjs(task.task_end));
    setTaskPriority(task.task_priority);
    setTaskStatus(task.task_status);
    setIsCollaborative(task.task_iscollaborative);
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
      task_iscollaborative: is_collaborative,
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
        if (is_collaborative) {
          colaborators.map(async (colaborator, ind) => {
            const teamData = {
              task_id: taskId,
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
        // Update the state with the new array
        setTasks(updatedTasks);
        setOpenEdit(false);
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
        {is_collaborative == 1 ? (
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
