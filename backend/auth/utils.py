from flask_jwt_extended import create_access_token
from datetime import timedelta
import os 

def generate_token(user_id):
    #create jwt with 7 day expiration
    #Include user_id and email in the JWT payload
    
    token = create_access_token(identity=str(user_id), expires_delta=timedelta(days=7))
    # print(token)
    return token
