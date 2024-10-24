from database.connect_db import *
from database.user_db import verify_user
from datetime import datetime

def suggestion_based_on_real_time():  
    try:
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

        return jsonify({
        "status":200,
        "message": "got suggestion successfully.",
        "return": alert_message
        }),200
    except Exception as e:
        return db_error(e,400)
