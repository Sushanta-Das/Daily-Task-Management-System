##### Project Title
## Daily-Task-Management-System


##### Database Setup
To create the database, run the following SQL script:
```./backend/database/create_database.sql```

##### Database Overview
![Screenshot 2024-10-20 214612](https://github.com/user-attachments/assets/0f3b4081-715d-4300-baac-21b6e2c19812)

### API response Format

```json
{
    "message": "deleted from task_subtask_joiner and task row deleted successfully.",
    "return": [
        22,
        "Play chess",
        "sus123",
        1
    ],
    "status": 200
}
```

### Background task
One background thread is running in each minute to update missed tasks bassed on end time.

### API Endpoints

#### Sign In
**POST** `http://127.0.0.1:8080/signin`
```json
{
    "user_email": "email",
    "user_id": "root",
    "user_password": 123
}
```

#### Sign Up
**POST** `http://127.0.0.1:8080/signup`
```json
{
    "user_id": "doremon2",
    "user_email": "doracake@japan.com2",
    "user_password": "1234567890",
    "user_name": "Doremon",
    "user_age": 18,
    "user_gender": "Male"
}
```

#### User Update
**PUT** `http://127.0.0.1:8080/user_update`  (no password changing)
```json
{
    "user_id": "doremon2",
    "user_email": "doracake@japan.com2",
    "user_password": "1234567890",
    "user_name": "Doremon new",
    "user_age": 18,
    "user_gender": "Male"
}
```

**PUT** `http://127.0.0.1:8080/user_update`  (password changing)
```json
{
    "user_id": "doremon2",
    "user_email": "doracake@japan.com2",
    "user_password": "1234567890",
    "user_name": "Doremon new",
    "user_age": 18,
    "user_gender": "Male",
    "user_new_password": "123"
}
```

## Task Access API

#### Get Tasks
**GET** `http://127.0.0.1:8080/task?user_id=sus123`

#### Add Task
**POST** `http://127.0.0.1:8080/task`
```json
{
    "task_name": "Play volleyball",
    "task_priority": "Medium",
    "task_creator": "tamal123",
    "task_comment": "At college IIIT KALYANI",
    "task_parent": null,
    "task_end": "2024-10-19 09:35:09",
    "user_password": "tamal123"
}
```

#### Add Subtask
**POST** `http://127.0.0.1:8080/task`
```json
{
    "task_name": "Play chess",
    "task_priority": "Medium",
    "task_creator": "tamal123",
    "task_comment": "At college",
    "task_parent": 1,
    "user_password": "tamal123"
}
```

#### Edit Task/Subtask  [creator only for that perticular task]
**PUT** `http://127.0.0.1:8080/task`
```json
{
    "task_id": 24,
    "user_password": "tamal123",
    "task_name": "Play chess in IIIT Kalyani"
}
```

#### Get Subtasks
**GET** `http://127.0.0.1:8080/subtask?task_id=3`

### Sharing Task/Schedule with Other Users

**POST** `http://127.0.0.1:8080/team_update`  (give permission)

**DELETE** `http://127.0.0.1:8080/team_update`  (remove permission)
```json
{
    "task_id": 1,
    "task_editor": "doremon",
    "user_id": "tamal123",
    "user_password": "tamal123"
}
```

#### Update Task Status/Comment [   editor, creator of any parent task] 
**PUT** `http://127.0.0.1:8080/status_comment`
```json
{
    "task_id": 6,
    "user_id": "doremon",
    "user_password": "1234567890",
    "task_status": "Done",
    "task_comment": "Helicopter"
}
```

#### Delete task/subtask/shared task [ creator of same / any parent task] *UPDATED
**DELETE** `http://127.0.0.1:8080/task`
```json
{
    "task_id":29,
    "user_id":"root",
    "user_password":"123"
}
```

#### Get suggestions 
**GET** `http://127.0.0.1:8080/suggestion` [ get suggestions ]
