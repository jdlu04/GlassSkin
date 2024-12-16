from flask import jsonify
from flask_jwt_extended import create_access_token
from datetime import timedelta

def generate_token(user_id):
    # Create a JWT with a 7-day expiration
    token = create_access_token(identity=user_id, expires_delta=timedelta(days=7))

    return token
