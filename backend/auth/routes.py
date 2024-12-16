from flask import Blueprint, request, jsonify, make_response
from dotenv import load_dotenv
from datetime import datetime, timezone
from supabase import create_client
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from .utils import generate_token
from supabase import create_client, Client
import bcrypt  
import uuid
import os

load_dotenv()

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase = create_client(url, key)


auth_bp = Blueprint('auth', __name__)


@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.json
    first_name = data.get("firstName")
    last_name = data.get("lastName")
    email = data.get("email")
    password = data.get("password")

    if not first_name  or not email or not password:
        return jsonify({"message": "All fields are required"}), 400

    if len(password) < 6:
        return jsonify({"message": "Password must be at least 6 characters"}), 400

    try:
        existing_user = supabase.table("users").select("*").eq("primaryEmailAddress", email).execute()
        if existing_user.data:
            return jsonify({"message": "Email already exists"}), 400

        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

        user_uuid = str(uuid.uuid4())

        new_user = {
            "id": user_uuid,
            "primaryEmailAddress": email,
            "firstName": first_name,
            "lastName": last_name,
            "createdAt": datetime.now(timezone.utc).isoformat(),
            "password": hashed_password 
        }

        response = supabase.table("users").insert(new_user).execute()

        if response.data:
            token = generate_token(user_uuid)
            resp = make_response(jsonify({
                "id": user_uuid,
                "firstName": first_name,
                "lastName": last_name,
                "email": email
            }), 201)
            resp.set_cookie("jwt", token, httponly=True, samesite="Strict", max_age=7*24*60*60)
            return resp

        return jsonify({"message": "Signup failed"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@auth_bp.route("/logout", methods=["POST"])
def logout():
    try:
        resp.set_cookie("jwt", "", max_age=0, httponly=True)
        resp = make_response(jsonify({"message": "Logged out successfully"}), 200)
        return resp
    except Exception as e:
        return jsonify({"error": "Failed to logout", "details": str(e)}), 500
