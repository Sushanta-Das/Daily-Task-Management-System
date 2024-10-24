from flask import Flask,jsonify,request
from flask_cors import CORS
from database.user_db import *
from database.task_db import *
from database.collaborate_db import*

def db_error(e,code):return {"status": code,"message": str(e),"return":[]}

def get_all_child_task_id(task_id):
    try:
        conn=create_connection()
        cursor=conn.cursor()
        cursor.execute(f"""WITH RECURSIVE ChildTasks AS (
                            SELECT subtask_id FROM task_subtask_joiner
                            WHERE task_id = %s 
                            UNION ALL
                            SELECT tt.subtask_id
                            FROM task_subtask_joiner tt
                            INNER JOIN ChildTasks ct ON tt.task_id = ct.subtask_id
                            )
                        SELECT * FROM ChildTasks;""",(task_id,))
        child_task_ids=cursor.fetchall()
        access_task_ids=set()
        for val in child_task_ids:
            if val:access_task_ids.add(val[0])
        access_task_ids.add(task_id)
        # params=(task_id,) + tuple(access_task_ids)
        return tuple(access_task_ids)
    except Exception as e:return None
    finally:cursor.close()

def get_user_authority_on_task(user_id,task_id)->str:
    try:
        conn=create_connection()
        cursor=conn.cursor()
        cursor.execute(f"""WITH RECURSIVE ParentTasks AS (
                                SELECT task_id, subtask_id
                                FROM task_subtask_joiner
                                WHERE subtask_id = %s  

                                UNION ALL

                                SELECT tt.task_id, tt.subtask_id
                                FROM task_subtask_joiner tt
                                JOIN ParentTasks pt ON tt.subtask_id = pt.task_id
                            )
                            SELECT task_id
                            FROM ParentTasks;""",(task_id,))
        parent_task_ids=cursor.fetchall() # getting all parent task_id
        access_task_ids=set()
        for val in parent_task_ids:
            if val:access_task_ids.add(val[0])
        access_task_ids.add(task_id) # any task_id has access on itself
        ids_placeholder = ', '.join(['%s'] * len(access_task_ids))
        params=(user_id,) + tuple(access_task_ids)

        #checking if task creator access
        cursor.execute(f"""SELECT task_creator 
                    FROM task_table 
                    WHERE task_creator=%s AND task_id IN ({ids_placeholder});""", params)
        rows=cursor.fetchall()
        if rows:
            access="Creator"
        else: # checking if has editor access in self/any parent
            cursor.execute(f"""SELECT user_id 
                        FROM user_task_joiner 
                        WHERE user_id=%s AND task_id IN ({ids_placeholder});""", params)
            rows=cursor.fetchall()
            if rows:access="Editor"
            else:access=None
        return access
    except Exception as e:return None
    finally:cursor.close()
def get_task_parents(task_id):
    try:
        conn=create_connection()
        cursor=conn.cursor()
        cursor.execute(f"""WITH RECURSIVE ParentTasks AS (
                                SELECT task_id, subtask_id
                                FROM task_subtask_joiner
                                WHERE subtask_id = %s  

                                UNION ALL

                                SELECT tt.task_id, tt.subtask_id
                                FROM task_subtask_joiner tt
                                JOIN ParentTasks pt ON tt.subtask_id = pt.task_id
                            )
                            SELECT task_id
                            FROM ParentTasks;""",(task_id,))
        parent_task_ids=cursor.fetchall() # getting all parent task_id
        access_task_ids=set()
        for val in parent_task_ids:
            if val:access_task_ids.add(val[0])
        access_task_ids.add(task_id) # any task_id has access on itself
        ids_placeholder = ', '.join(['%s'] * len(access_task_ids))
        access_task_ids= tuple(access_task_ids)

        cursor.execute(f"""SELECT user_id 
                        FROM user_task_joiner 
                        WHERE task_id IN ({ids_placeholder});""", access_task_ids)
        
        user_ids=cursor.fetchall()
        access_user_ids=set()
        for val in user_ids:
            if val:access_user_ids.add(val[0])
        access_user_ids=tuple(access_user_ids)
        return access_task_ids,access_user_ids
    except Exception as e:return None
    finally:cursor.close()

def status_comment_edit_creator_editor_dynamic(data):
    try:        # data acess and user authentication
        user_id,user_password= data["user_id"].strip(),data["user_password"].strip()
        task_id,task_status,task_comment=data["task_id"],data["task_status"].strip(),data["task_comment"]
        res,status_code=verify_user(user_id,user_password)
        if status_code !=200:
            return res,status_code
    except Exception as e:
        return db_error(e,400),400
    
    # after authentication and data input
    authority=get_user_authority_on_task(user_id,task_id) # Creator,Editor,None
    conn=create_connection()
    cursor=conn.cursor()        
    try:
        if authority in ["Creator","Editor"] :   # either creator or editor
            if task_status.lower()=="done": # adding task executor
                cursor.execute(f"""UPDATE task_table SET task_status=%s,task_comment=%s,task_executor=%s 
                                    WHERE task_id=%s;""",(task_status,task_comment,user_id,task_id,))
                message,status_code=f"task status / comment updated successfully and {user_id} marked as task_executor.",200
                
            else:
                cursor.execute(f"""UPDATE task_table SET task_status=%s,task_comment=%s
                                    WHERE task_id=%s;""",(task_status,task_comment,task_id,))
                message,status_code="task status / comment updated successfully.",200
            conn.commit()
        else:message,status_code=f"user '{user_id}' is not eligible to update task status / comment.",401
        return jsonify({
            "status":status_code,
            "message": message,
            "return": [user_id,task_status,task_comment,task_id]
            }),status_code
    except Exception as e:
        return db_error(e,400),400
    finally:
        cursor.close()

def editor_add_edit_delete(data,method):   # add,edit,remove row from user_task_joiner
    try:        # data acess and user authentication
        user_id,user_password= data["user_id"].strip(),data["user_password"].strip()
        task_id,task_editor=data["task_id"],data["task_editor"].strip()
        res,status_code=verify_user(user_id,user_password)
        if status_code !=200:
            return res,status_code
    except Exception as e:
        return db_error(e,400),400

    # after authentication
    conn=create_connection()
    cursor=conn.cursor()
    try:
        cursor.execute(f"""SELECT task_creator 
                       FROM task_table WHERE task_id=%s;""",(task_id,))
        rows=cursor.fetchall()
        # print(rows)

        task_creator=rows[0][0]
        # print(user_id==task_creator)

        if user_id==task_creator:       # attempt made by creator
            cursor.execute("""SELECT user_id,task_id from user_task_joiner 
                           WHERE user_id=%s AND task_id=%s ;""",(task_editor,task_id,)) # 
            rows=cursor.fetchall()

            access_task_ids,access_user_ids=get_task_parents(task_id)
            # print(rows)
            if rows:    # verified , creator and old data hence delete data  in DELETE
                if method=="POST":message,status_code="already shared hence ignored.",200
                else:
                    cursor.execute("""DELETE FROM user_task_joiner
                                   WHERE user_id=%s AND task_id=%s;""",(task_editor,task_id,))
                    
                    if len(access_user_ids)==2: # had 2 users before delete so after no collab only creator
                        cursor.execute("""UPDATE task_table SET task_iscollaborative=%s 
                                       WHERE task_id=%s;""",(False,task_id,))
                    conn.commit()
                    message,status_code=f"removed permission of '{task_editor}' from user_task_joiner",200
            else:       # verified , creator and new data hence add data  in POST
                if method=="POST":
                    cursor.execute("""INSERT INTO user_task_joiner (user_id,task_id) 
                                VALUES (%s,%s)""",(task_editor,task_id,))
                    
                    if len(access_user_ids)==1: # had creator only hence marking as collab
                        cursor.execute("""UPDATE task_table SET task_iscollaborative=%s 
                                       WHERE task_id=%s;""",(True,task_id,))
                        
                    conn.commit() # writing changes to the database
                    message,status_code=f"sharing with '{task_editor}', new row added in user_task_joiner.",201
                else:
                    message,status_code=f"enter a valid permission first for '{task_editor}' to remove it from user_task_joiner.",400

            access_task_ids,new_access_user_ids=get_task_parents(task_id)
            return jsonify({
            "status":status_code,
            "message": message,
            "return": [task_id,task_creator,task_editor,{"previous_collaborators":access_user_ids,"new_collaborators":new_access_user_ids}]
            }),status_code
        return jsonify({
            "status":401,
            "message": f"only the creator '{task_creator}' can add/delete editor '{task_editor}' to a task/routine.",
            "return": []
            }),401
    except Exception as e:
        # print(verified_msg)
        return db_error(e,400),400
    finally:
        cursor.close()

def nested_delete_task_by_parent_creator(data):
    try:        # data acess and user authentication
        user_id,user_password= data["user_id"].strip(),data["user_password"].strip()
        task_id=data["task_id"]
        res,status_code=verify_user(user_id,user_password)
        if status_code !=200:
            return res,status_code
    except Exception as e:
        return db_error(e,400),400
    
    # after authentication and data input
    authority=get_user_authority_on_task(user_id,task_id) # Creator,Editor,None
    conn=create_connection()
    cursor=conn.cursor()
    try:
        all_child_ids=get_all_child_task_id(task_id)
        # now
        if all_child_ids and authority=="Creator": # onlo creator/creator of parent can delete
            format_strings = ','.join(['%s'] * len(all_child_ids))  # Create placeholders for each task_id


            # delete from user_task_joiner      using primary key: task_id 
            # as when creator delete all looses access
            cursor.execute(f"""DELETE FROM user_task_joiner 
                            WHERE task_id IN ({format_strings});""", all_child_ids)

            # delete from task_subtask_joiner   using primary key: subtask_id
            cursor.execute(f"""DELETE FROM task_subtask_joiner 
                               WHERE subtask_id IN ({format_strings});""", all_child_ids)

            # delete from task_table            using primary key: task_id
            cursor.execute(f"""DELETE FROM task_table 
                               WHERE task_id IN ({format_strings});""", all_child_ids)

            # all deletes are successful, commit the transaction
            conn.commit()
            message,status_code=f"""deleted rows with task/subtask_id: {all_child_ids} from task_table, 
            task_subtask_joiner and user_task_joiner , attempted by '{user_id}' : '{authority}'.""",200

        else:
            message=f"""unable to delete , attempted by '{user_id}' : '{authority}' , 
            requested to delete all presence of task/subtask_id : {all_child_ids}."""
            if authority=="Creator":status_code=400
            else:status_code=401
        return jsonify({
            "status":status_code,
            "message": message,
            "return": all_child_ids
            }),status_code
    except Exception as e:
        # if anyone fail then rollback and give message="unable to delete " and rollback
        conn.rollback()
        print('Unable to delete and rollbacked : ', str(e))
        return db_error(e,400),400
    finally:
        cursor.close() 