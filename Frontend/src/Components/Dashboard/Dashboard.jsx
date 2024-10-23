import * as React from "react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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

// Dashboard After login
export default function Dashboard() {
  const [value, setValue] = React.useState(0);
  const [tasks, setTasks] = useState([]);
  const location = useLocation();
  const { user } = location.state || {};
  const base = "http://127.0.0.1:8080";
  const [userObj, setUserObj] = useState({
    user_email: user.user_email,
    user_id: user.user_id,
    user_password: user.user_password,
  });

  useEffect(() => {
    console.log(user);
    async function fetchTasks() {
      try {
        // Replace with actual fetch request to your backend
        const response = await fetch(`${base}/task?user_id=${user.user_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status !== 200) {
          console.error("Failed to fetch tasks:", response);
          return;
        }
        const data = await response.json();
        console.log(data);
        setTasks(data);
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
          <Tab label="Kanban" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <CurrentTasks tasks={tasks} setTasks={setTasks} user={userObj} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <PreviousTasks tasks={tasks} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        kanban board
      </CustomTabPanel>
    </Box>
  );
}
