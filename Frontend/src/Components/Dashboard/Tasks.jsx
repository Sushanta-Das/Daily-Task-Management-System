import React from "react";

export const Tasks = ({ tasks, setTasks }) => {
  return (
    <div style={{ marginTop: "2vh" }}>
      Active Tasks
      {tasks.map((task, ind) => (
        <div key={ind}>
          <h1>{task.task_name}</h1>
          {/* <button
            onClick={() => {
              setTasks(tasks.filter((t) => t.task !== task.task));
            }}
          >
            Delete
          </button> */}
        </div>
      ))}
    </div>
  );
};
