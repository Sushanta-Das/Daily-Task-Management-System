import React from "react";
import {
  BrowserRouter,
  Outlet,
  Route,
  Routes,
  NavLink,
  useLocation,
} from "react-router-dom";
import { useState } from "react";
import { AddTask } from "./AddTask";
import { Task } from "@mui/icons-material";
import { Currenttasks } from "./Currenttasks";
import { Tabs, Tab } from "@mui/material";
import { PreviousTasks } from "./PreviousTasks";
import "./dashboard.css";
const Dashboard = () => {
  const [tasks, setTasks] = useState([{ task: "Task 1" }]);
  return (
    <>
      <BrowserRouter
      // basename={import.meta.env.DEV ? "/" : "/"}
      >
        <Routes>
          <Route path="/" element={<Root />}>
            {/* <Route index element={<Profile />} /> */}
            <Route
              path="/CurrentTasks"
              element={<Currenttasks tasks={tasks} setTasks={setTasks} />}
            />

            <Route
              path="/PreviousTasks"
              element={<PreviousTasks tasks={tasks} />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

const Root = () => {
  const location = useLocation();
  return (
    <>
      <div class="container">
        <aside>
          <Tabs>
            <Tab label="Current Tasks" to="/CurrentTasks" />
            <Tab label="Previous Tasks" to="/PreviousTasks" />
          {/* <div className="navbar">
            <NavLink to="/CurrentTasks" id="profile" className="menu-item">
              Current Tasks
            </NavLink>

            <NavLink to="/PreviousTasks" className="menu menu-item">
              Previous Tasks
            </NavLink>
          </div> */}
          </Tabs>
        </aside>

        <section id="RightSection">
          <Outlet />
        </section>
      </div>{" "}
    </>
  );
};

export default Dashboard;
