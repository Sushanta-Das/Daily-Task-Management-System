import os
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
from flask import jsonify
load_dotenv()

db_host = os.getenv('DB_HOST')
db_user = os.getenv('DB_USER')
db_password = os.getenv('DB_PASSWORD')
db_name = os.getenv('DB_NAME')

def db_error(e,code):return {"status": code,"message": str(e),"return":[]}

TASK_TABLE=" tt.task_id,tt.task_name,tt.task_priority,tt.task_iscollaborative,tt.task_start,tt.task_end,tt.task_creator,tt.task_executor,tt.task_status,tt.task_comment,tt.task_isparent "
USER_TABLE=" ut.user_id,ut.user_email,ut.user_name,ut.user_age,ut.user_gender "

def create_connection():
    """Create a database connection to the MySQL server."""
    connection = None
    try:
        connection = mysql.connector.connect(
            host=db_host,
            user=db_user,
            password=db_password,
            database=db_name
        )
        # if connection.is_connected():print("Connection to MySQL DB successful")
    except Error as e:
        print(f"The error '{e}' occurred")
    return connection