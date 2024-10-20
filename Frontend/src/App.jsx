import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
// import TabsDash from "./Components/Dashboard/TabsDash.jsx";
import Dashboard from "./Components/Dashboard/Dashboard.jsx";
import LandingPage from "./Components/SignUpAndLogin/LandingPage.jsx";
import DashboardDummy from "./Components/Dashboard/DashboardDummy.jsx";

//Entry point of the application
// Route to the landing page and dashboard
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
