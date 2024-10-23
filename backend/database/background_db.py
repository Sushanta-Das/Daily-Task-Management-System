from database.connect_db import *
# from time import sleep

def update_missed_task_status():
    conn=create_connection()
    cursor=conn.cursor()
    try:
        cursor.execute("""UPDATE task_table SET task_status = 'Missed'
                WHERE task_end < NOW() AND task_status <> 'Missed';""")
        conn.commit()
        # print("Updated\n")
    except Error as e:
        conn.rollback()
        return db_error(e,400),400
    finally:
        cursor.close()

# def background_tasks():
#     while True:
#         update_missed_task_status()
#         sleep(60) # updating in each minute
