from flask import Blueprint, request, jsonify, make_response, g
from dotenv import load_dotenv
from datetime import datetime, timezone
from supabase import create_client
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from .utils import generate_token
from supabase import create_client, Client
import bcrypt  
import uuid
import os
from .middleware import protect_route

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

    #check if all fields filled 
    if not first_name  or not email or not password:
        return jsonify({"message": "All fields are required"}), 400

    #password must be longer than 6 characters
    if len(password) < 6:
        return jsonify({"message": "Password must be at least 6 characters"}), 400

    try:
        #check if user exists already 
        existing_user = supabase.table("users").select("*").eq("primaryEmailAddress", email).execute()
        if existing_user.data:
            return jsonify({"message": "Email already exists"}), 400

        #hash password 
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

        #create uuid for new user 
        user_uuid = str(uuid.uuid4())

        #prepare new user data 
        new_user = {
            "id": user_uuid,
            "primaryEmailAddress": email,
            "firstName": first_name,
            "lastName": last_name,
            "createdAt": datetime.now(timezone.utc).isoformat(),
            "password": hashed_password 
        }

        #insert new user into db 
        response = supabase.table("users").insert(new_user).execute()

        if response.data:
            token = generate_token(new_user["id"]) #generate token for user
            resp = make_response(jsonify({
                "id": user_uuid,
                "firstName": first_name,
                "lastName": last_name,
                "email": email
            }), 201)
            resp.set_cookie("jwt", token, httponly=True, samesite="Strict", max_age=7 * 24 * 60 * 60) #set jwt as cookie 
            return resp

        return jsonify({"message": "Signup failed"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500
      

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    #check if inputs are valid
    if not email or not password:
        return jsonify({"message": "All fields are required"}), 400

    try:
        #check if user exists 
        user_response = supabase.table("users").select("*").eq("primaryEmailAddress", email).execute()
        if not user_response.data:
            return jsonify({"message": "Invalid credentials"}), 400

        user = user_response.data[0] 

        #hash password and check if it matches hashed password in db 
        hashed_password = user["password"]
        if not bcrypt.checkpw(password.encode("utf-8"), hashed_password.encode("utf-8")):
            return jsonify({"message": "Invalid credentials"}), 400

        #create jwt 
        token = generate_token(user["id"])

        resp = make_response(jsonify({
            "id": user["id"],
            "firstName": user["firstName"],
            "lastName": user["lastName"],
            "email": user["primaryEmailAddress"]
        }), 200)

        #set jwt as cookie
        resp.set_cookie("jwt", token, httponly=True, samesite="Strict", max_age=7 * 24 * 60 * 60)

        return resp

    except Exception as e:
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500


@auth_bp.route("/logout", methods=["POST"])
def logout():
    try:
        #clear jwt cookie
        resp = make_response(jsonify({"message": "Logged out successfully"}), 200)
        resp.set_cookie("jwt", "", max_age=0, httponly=True)
        return resp
    except Exception as e:
        return jsonify({"error": "Failed to logout", "details": str(e)}), 500
      
#check users authentication status and return user object if authenticated
@auth_bp.route("/checkauth", methods=["GET"])
@protect_route
def check_auth():
    try:
        # Access the user data from the middleware (g.user)
        user_data = g.user
        return jsonify(user_data), 200
    except Exception as e:
        return jsonify({"message": "Internal Server Error", "error": str(e)}), 500


#syncs clerk users to db 
@auth_bp.route('/sync_user', methods=['POST'])
def sync_user():
    data = request.json
    user_id = data.get("id")
    email = data.get("primaryEmailAddress")
    created_at = data.get("createdAt")
    first_name = data.get("firstName") or None
    last_name = data.get("lastName") or None

    user_uuid = str(uuid.uuid4())

    user_data = {
        "id": user_uuid,
        "clerk_id": user_id,
        "primaryEmailAddress": email,
        "createdAt": created_at,
        "firstName": first_name,
        "lastName": last_name,
    }

    user = supabase.table("users").select().eq("clerk_id", user_id).execute()
    if not user.data:
        user = supabase.table("users").insert(user_data).execute()
        return jsonify({"message": "User added successfully"}), 201
    else:
        return jsonify({"message": "User already exists"}), 200

