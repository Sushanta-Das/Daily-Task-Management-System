USE daily_task_management ;

CREATE TABLE user_table (
    user_id VARCHAR(50) PRIMARY KEY,  -- User-defined ID
    user_email VARCHAR(255) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    user_age INT,  -- Optional, can be NULL
    user_gender ENUM('Male', 'Female', 'Other') DEFAULT 'Male'
);

-- SELECT * FROM daily_task_management.users;

-- DROP TABLE users_table;
INSERT INTO user_table (user_id, user_email, user_password, user_name, user_age, user_gender)
VALUES 
('tamal123','tamal@gmail.com','tamal123','Tamal Mallick',21,'Male'),
('poltu', 'poltu@gmail.com', 'poltul123', 'Poltu Sorder', 17, 'Male'),
('sus123', 'sus@gmail.com', 'sus123', 'Sushanta Das', 22, 'Male');

CREATE TABLE task_table (
    task_id INT AUTO_INCREMENT PRIMARY KEY,
    task_name VARCHAR(255) NOT NULL,
    task_priority ENUM('High', 'Medium', 'Low') DEFAULT 'Medium',
    task_iscollaborative BOOLEAN DEFAULT false,
    task_start DATETIME DEFAULT CURRENT_TIMESTAMP,
    task_end DATETIME DEFAULT (CURRENT_TIMESTAMP + INTERVAL 24 HOUR),
    task_creator VARCHAR(50) NOT NULL,  -- Change to VARCHAR(50)
    task_executor VARCHAR(50) DEFAULT NULL,
    task_status ENUM('Active', 'Pending', 'Missed','Executed', 'Done') default 'Active',
    task_comment TEXT DEFAULT NULL,
    task_parent INT DEFAULT NULL,
    FOREIGN KEY (task_creator) REFERENCES user_table(user_id),
    FOREIGN KEY (task_executor) REFERENCES user_table(user_id),
    CHECK (task_end > task_start)
);


DROP TABLE task_table;

INSERT INTO task_table (task_name, task_priority, task_iscollaborative, task_creator, task_executor, task_status, task_comment, task_parent)
VALUES 
('Programming', 'High', false, 'tamal123', NULL, 'Active', 'none', NULL),  -- tamal123
('Study', 'Medium', false, 'sus123', NULL, 'Pending', NULL, NULL),            -- sus123
('DSA', 'Medium', false, 'tamal123', NULL, 'Done', 'Keep going', 1),     -- tamal123
('Work on Task Manager', 'High', true, 'tamal123', NULL, 'Missed', NULL, 1),  -- tamal123
('Solve 3 problems on linked list', 'Medium', false, 'tamal123', NULL, 'Done', 'Good Job', 3),  -- tamal123
('Solve 2 problems on array', 'Low', false, 'tamal123', NULL, 'Done', 'Good Job', 3);  -- tamal123

CREATE TABLE task_subtask_joiner (
    task_id INT NOT NULL,
    subtask_id INT PRIMARY KEY,
    FOREIGN KEY (task_id) REFERENCES task_table(task_id),
    FOREIGN KEY (subtask_id) REFERENCES task_table(task_id)
);
DROP TABLE task_subtask_joiner;

INSERT INTO task_subtask_joiner (task_id, subtask_id)
VALUES 
(1, 3),  -- Task 1 is the parent of Task 3
(1, 4),  -- Task 1 is the parent of Task 4
(3, 5),  -- Task 3 is the parent of Task 5
(3, 6);  -- Task 3 is the parent of Task 6

USE daily_task_management ;

CREATE TABLE user_task_joiner (
    user_id VARCHAR(50) NOT NULL,
    task_id INT NOT NULL,
    PRIMARY KEY (user_id, task_id),
    FOREIGN KEY (user_id) REFERENCES user_table(user_id),
    FOREIGN KEY (task_id) REFERENCES task_table(task_id)
);
DROP TABLE user_task_joiner;

INSERT INTO user_task_joiner (user_id, task_id) VALUES ('tamal123', 1);
INSERT INTO user_task_joiner (user_id, task_id) VALUES ('sus123', 2);
INSERT INTO user_task_joiner (user_id, task_id) VALUES ('sus123', 1);


WITH RECURSIVE ChildTasks AS (
    -- Base case: get direct subtasks for the specified task_id
    SELECT subtask_id
    FROM task_subtask_joiner
    WHERE task_id = 1  -- Replace 1 with your desired parent task_id

    UNION ALL

    -- Recursive case: join to find further subtasks
    SELECT tt.subtask_id
    FROM task_subtask_joiner tt
    INNER JOIN ChildTasks ct ON tt.task_id = ct.subtask_id
)
SELECT * FROM ChildTasks;

WITH RECURSIVE ParentTasks AS (
    SELECT task_id, subtask_id
    FROM task_subtask_joiner
    WHERE subtask_id = 26  -- Replace with your specific subtask_id

    UNION ALL

    SELECT tt.task_id, tt.subtask_id
    FROM task_subtask_joiner tt
    JOIN ParentTasks pt ON tt.subtask_id = pt.task_id
)
SELECT task_id
FROM ParentTasks
ORDER BY task_id
LIMIT 1;  -- Get the root task_id

WITH RECURSIVE ParentTasks AS (
    SELECT task_id, subtask_id
    FROM task_subtask_joiner
    WHERE subtask_id = 28  -- Replace with your specific subtask_id

    UNION ALL

    SELECT tt.task_id, tt.subtask_id
    FROM task_subtask_joiner tt
    JOIN ParentTasks pt ON tt.subtask_id = pt.task_id
)
SELECT task_id
FROM ParentTasks;
ORDER BY task_id
LIMIT 1;  -- Get the root task_id

SELECT user_id 
FROM user_task_joiner 
WHERE task_id IN (1,3,26);

WITH RECURSIVE ParentTasks AS (
    SELECT task_id, subtask_id
    FROM task_subtask_joiner
    WHERE subtask_id = 3  

    UNION ALL

    SELECT tt.task_id, tt.subtask_id
    FROM task_subtask_joiner tt
    JOIN ParentTasks pt ON tt.subtask_id = pt.task_id
)
SELECT DISTINCT utj.user_id
FROM user_task_joiner utj
JOIN ParentTasks pt ON utj.task_id = pt.task_id
OR pt.subtask_id = 3;  


USE daily_task_management ;

SELECT user_id 
FROM user_task_joiner 
WHERE user_id="sus123" AND task_id IN (1,3,26);  -- creator / editor has access

SELECT * 
FROM task_table 
WHERE task_creator="doremon" AND task_id IN (1,3,26,28);  -- creator/creator of parent has access only

