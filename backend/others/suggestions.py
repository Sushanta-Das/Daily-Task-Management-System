from flask import Flask, request, jsonify
from datetime import datetime

app = Flask(__name__)

@app.route('/suggestion_on_completion_of_task/task_id', methods=['POST'])
def suggestion_on_completion_of_task(task_id):
    if task_id in tasks:        
        updated_data = request.get_json()
        old_status = tasks[task_id]['status']
        new_status = updated_data.get('status')

        tasks[task_id]['title'] = updated_data.get('title', tasks[task_id]['title'])
        tasks[task_id]['status'] = new_status

        if old_status != 'complete' and new_status == 'complete':
            return jsonify({"message": "Take some rest", "alert": True})

        return jsonify({"message": "Task updated successfully", "alert": False})
    
    return jsonify({"message": "Task not found"}), 404

@app.route('/suggestion_based_on_real_time', methods=['POST'])
def suggestion_based_on_real_time():  
    login_data = request.get_json()
    username = login_data.get('username')
    password = login_data.get('password')

    if username in users and users[username]['password'] == password:
        # Getting the current time
        current_time = datetime.now().hour
        
        if 6 <= current_time < 9:
            alert_message = "Good morning! It's time for jogging."
        elif 9 <= current_time < 12:
            alert_message = "Time to focus on work!"
        elif 12 <= current_time < 14:
            alert_message = "It's lunch time! Take a break."
        elif 14 <= current_time < 17:
            alert_message = "Afternoon time! Read some books."
        elif 17 <= current_time < 20:
            alert_message = "Evening! Time for a workout or a walk."
        else:
            alert_message = "Relax, it's time to take rest."

        return jsonify({"message": "Login successful", "alert": alert_message})
  
    return jsonify({"message": "Invalid username or password"}), 401