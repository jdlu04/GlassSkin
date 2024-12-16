from flask import request, jsonify, g
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from functools import wraps

def protect_route(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            # Verify JWT
            verify_jwt_in_request()

            # Get JWT identity
            decoded = get_jwt_identity()
                       
            # Handle both string and dictionary identities
            if isinstance(decoded, str):
                # If it's a string (user_id), use it directly
                user_id = decoded
            elif isinstance(decoded, dict):
                # If it's a dictionary, try to get user_id
                user_id = decoded.get('user_id')
            else:
                return jsonify({"message": "Unauthorized - Invalid Token"}), 401

            # Validate user_id
            if not user_id:
                return jsonify({"message": "Unauthorized - Missing User ID"}), 401

            # Attach user data to globally available information
            g.user = {
                "id": user_id,
            }

            # Call decorated function and return its results
            return f(*args, **kwargs)

        except Exception as e:
            print("JWT Verification Error:", str(e))
            return jsonify({"message": "Internal server error", "error": str(e)}), 500

    return decorated_function