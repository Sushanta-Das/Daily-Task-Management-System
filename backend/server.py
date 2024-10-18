from flask import Flask,jsonify,request
from database.user_db import *
from database.task_db import *
app = Flask(__name__)


## Base url setup

@app.route('/')
def home():
    return "hello tamal"

@app.route('/<user_id>')
def get_table(user_id):
    return get_user_tasks(user_id)


## get & update User log in ,sign up , update details

@app.route('/signin')
def user_signin():
    data={}
    data["user_id_email"],data["user_password"] = request.args.get('user'),request.args.get('password')
    return verify_user(data) # sending json data

@app.route('/signup',methods=["POST"])
def user_signup():
    form_data = request.json
    return create_new_user(form_data)

@app.route('/update',methods=["POST"])
def update_user_details():
    form_data = request.json
    return update_existing_user_details(form_data)



## get and update daily tasks and its subtasks

@app.route("/task",methods=["GET"]) # http://127.0.0.1:8080/tasks?TaskCreatorID=sus123
def get_tasks(): 
    user_id = request.args.get('user_id', type=str)
    return get_user_tasks(user_id)

@app.route("/task",methods=["POST","PUT","DELETE"])
def create_edit_task(): 
    task_data=request.json
    if request.method=="POST":
        return task_subtask_table_entry(task_data)
    elif request.method=="PUT":
        return task_subtask_table_edit(task_data)
    elif request.method=="DELETE":
        return delete_task_subtask(task_data)
        
@app.route("/subtask",methods=["GET"])
def get_subtask(): 
    task_id = request.args.get('task_id', type=str)
    return get_task_subtasks(task_id)
    
if __name__ == '__main__':
    app.run(debug=True, port=8080)
