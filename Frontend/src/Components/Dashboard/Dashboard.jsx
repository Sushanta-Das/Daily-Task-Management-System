import * as React from "react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { CurrentTasks } from "./CurrentTasks";
import { PreviousTasks } from "./PreviousTasks";
import "./dashboard.css";
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Dashboard() {
  const [value, setValue] = React.useState(0);
  const [tasks, setTasks] = useState([]);
  const base = "http://127.0.0.1:8080";
  const [user, setUser] = useState({
    user_email: "sushanta@gmail.com",
    user_id: "sus123",
    user_password: "sus123",
  });

  useEffect(() => {
    // Simulate fetching tasks from a backend API
    async function fetchTasks() {
      try {
        // Replace with actual fetch request to your backend
        const response = await fetch(`${base}/task?user_id=sus123`);

        const data = await response.json();
        console.log(data);
        setTasks(data); // Assume the backend returns an array of tasks
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    }

    fetchTasks();
  }, [user]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Current Tasks" {...a11yProps(0)} />
          <Tab label="Previous Tasks" {...a11yProps(1)} />
          <Tab label="Other" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <CurrentTasks tasks={tasks} setTasks={setTasks} user={user} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <PreviousTasks tasks={tasks} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Item Three
      </CustomTabPanel>
    </Box>
  );
}
