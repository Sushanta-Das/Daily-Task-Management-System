import React from "react";
import { AddTask } from "./AddTask";
import { Tasks } from "./Tasks";
export const Dashboard = () => {
  return (
    <div>
      
      <AddTask />
      <Tasks />
    </div>
  );
};
