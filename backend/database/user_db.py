from database.connect_db import *
from flask import jsonify
USER_TABLE=" ut.user_id,ut.user_email,ut.user_name,ut.user_age,ut.user_gender "

def sign_in(data):
    if "user_password" in data.keys() and data['user_password'].strip():
        password=data['user_password'].strip()
        if "user_id" in data.keys() and data['user_id'].strip():
            return verify_user(data['user_id'],password)
        elif "user_email" in data.keys() and data["user_email"].strip():
            return verify_user(data["user_email"],password)
    return jsonify({
        "status":400,
        "message": f"user_id/user_email and user_password is required.",
        "return": []
    }),400
    

def verify_user(user,password): # sign in
    conn=create_connection()
    cursor=conn.cursor()
    try:
        user_id_email,user_password=user.strip(),password.strip()
        query=f"""SELECT {USER_TABLE} FROM user_table as ut 
                WHERE user_password=%s and (user_id=%s or user_email=%s);"""
        cursor.execute(query,(user_password,user_id_email,user_id_email,))
        account = cursor.fetchall()
        if account:
            rows = {
                    "status":200,
                    "message": "account verified successfully.",
                    "return": account
                    }
            return jsonify(rows),200
        else:
            rows = {
                    "status":401,
                    "message": "invalid user id/ email , password.",
                    "return": []
                    }
            return jsonify(rows),401 # case un-authorized
    except Error as e:
        return db_error(e,400),400
    finally:
        cursor.close()

def create_new_user(data):
    conn=create_connection()
    cursor=conn.cursor()
    required_fields = ['user_id', 'user_email', 'user_password', 'user_name', 'user_age', 'user_gender']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"'{field}' is required."}), 400
        
    id = data['user_id'].strip()
    email = data['user_email'].strip()
    password = data['user_password'].strip()
    name = data['user_name'].strip()
    age = data['user_age']
    gender = data['user_gender'].strip()
    try:
        query=f"""INSERT INTO user_table (user_id, user_email, user_password, user_name, user_age, user_gender) 
                VALUES (%s, %s,%s,%s,%s,%s);"""
        cursor.execute(query,(id,email,password,name,age,gender,))
        conn.commit() # writing the database transaction 
        rows = {
        "status":201,
        "message": "account created successfully.",
        "return": [id,email,name,age,gender]
        }
        return jsonify(rows),201
    except Error as e:
        conn.rollback()
        return db_error(e,400),400
    finally:
        cursor.close() 

def update_existing_user_details(data):

    required_fields = ['user_id', 'user_email', 'user_password', 'user_name', 'user_age', 'user_gender']

    for field in required_fields:
        if field not in data:
            return jsonify({"status":400,"message": f"'{field}' is required.","return":[]}), 400
    
    id = data['user_id'].strip()
    email = data['user_email'].strip()
    current_password = data['user_password'].strip()
    name = data['user_name'].strip()
    age = data['user_age']
    gender = data['user_gender'].strip()
    
    _,status_code=verify_user(id,current_password)

    if "user_new_password" not in data.keys() or not data['user_new_password']:
        new_password=current_password
    else:
        new_password=data['user_new_password'].strip()
    

    if status_code!=200:    # unable to verify
        return jsonify({"status":401,"message":"un-authorized trial , account not updated.","return":[]}),400
    conn=create_connection()
    cursor=conn.cursor()
    try:
        query = """
        UPDATE user_table
        SET user_email = %s,
            user_password = %s,
            user_name = %s,
            user_age = %s,
            user_gender = %s
        WHERE user_id = %s"""
        cursor.execute(query,(email,new_password,name,age,gender,id,))
        conn.commit() # writing the transaction 
        rows = {
        "status":200,
        "message": "account updated successfully.",
        "return": [id,email,name,age,gender]
        }
        return jsonify(rows),200
    except Error as e:
        conn.rollback()
        return db_error(e,400),400
    finally:
        cursor.close() 
