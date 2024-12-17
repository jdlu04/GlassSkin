from flask import request, jsonify, g
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from functools import wraps
from jwt import PyJWKClient
import jwt
import requests

# Clerk's JWKs URL
CLERK_JWKS_URL = "https://magnetic-swine-40.clerk.accounts.dev/.well-known/jwks.json"

# Fetch and cache Clerk's JWKs
def get_clerk_jwks():
    try:
        response = requests.get(CLERK_JWKS_URL)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return None

def verify_clerk_token(token):
    try:
        # print(f"Verifying Clerk token: {token}")

        jwk_client = PyJWKClient(CLERK_JWKS_URL)
        signing_key = jwk_client.get_signing_key_from_jwt(token)

        decoded = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            issuer="https://magnetic-swine-40.clerk.accounts.dev",  # Validate the issuer
            options={"verify_aud": False},  # Disable 'aud' claim validation
            leeway=10
        )

        # print("Clerk token successfully verified. Decoded payload:", decoded)

        # Return user information
        return {
            "user_id": decoded.get("sub")
        }

    except jwt.ExpiredSignatureError:
        print("Error: Clerk JWT Expired.")
        return None
    except jwt.InvalidTokenError as e:
        print(f"Error: Clerk JWT Invalid - {e}")
        return None
    except Exception as e:
        print(f"Unexpected Clerk token verification error: {e}")
        return None

# Protect route middleware
def protect_route(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            # print("Checking for Authorization header...")
            auth_header = request.headers.get("Authorization")
            # print(f"Authorization header: {auth_header}")

            if auth_header and auth_header.startswith("Bearer "):
                # print("Clerk token detected in Authorization header.")
                clerk_token = auth_header.split(" ")[1]
                clerk_user = verify_clerk_token(clerk_token)

                if clerk_user:
                    # print("Clerk user authenticated successfully:", clerk_user)
                    g.user = {
                        "clerk_id": clerk_user["user_id"],
                        "auth_provider": "clerk"
                    }
                    return f(*args, **kwargs)
                else:
                    print("Failed to authenticate Clerk token.")
                    return jsonify({
                        "message": "Unauthorized - Invalid Clerk Token",
                        "error": "Token verification failed"
                    }), 401

            # print("No Clerk token found. Checking for local JWT...")
            verify_jwt_in_request()  # Verify JWT in cookies
            decoded = get_jwt_identity()
            # print("Decoded local JWT payload:", decoded)

            # Handle both string and dictionary identities
            if isinstance(decoded, str):
                user_id = decoded
            elif isinstance(decoded, dict):
                user_id = decoded.get("user_id")
            else:
                # print("Invalid local JWT format.")
                return jsonify({"message": "Unauthorized - Invalid Token"}), 401

            # Validate user_id
            if not user_id:
                print("Missing user_id in local JWT.")
                return jsonify({"message": "Unauthorized - Missing User ID"}), 401

            print("Local user authenticated successfully. User ID:", user_id)
            g.user = {
                "id": user_id,
                "auth_provider": "local"
            }

            return f(*args, **kwargs)

        except Exception as e:
            print("Authentication Verification Error:", str(e))
            return jsonify({
                "message": "Internal server error",
                "error": str(e)
            }), 500

    return decorated_function
