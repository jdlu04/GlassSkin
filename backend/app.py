import flask
from flask import request, jsonify
import flask_cors  
from flask_cors import CORS
from dotenv import load_dotenv
import os
from supabase import create_client, Client
import requests
from bs4 import BeautifulSoup
import json
from flask_jwt_extended import JWTManager
from auth.routes import auth_bp

#note to professor, we have six routes in app.py, and 5 routes in auth/routes.py.
app = flask.Flask(__name__)
CORS(app, supports_credentials=True, allow_headers=["Content-Type", "Authorization"])

load_dotenv()

# Initialize JWT
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
app.config["JWT_ACCESS_COOKIE_NAME"] = "jwt"
jwt = JWTManager(app)

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase = create_client(url, key)


app.register_blueprint(auth_bp, url_prefix='/api/auth')

@app.route('/', methods=['GET'])
def home():  # redirect a user to the correct page. currently its a suggestion to go to /api/makeup
    return 'Hey there! You are on the home page of the Makeup API. Try /api/recommended instead!'


@app.route('/api/recommended', methods=['GET'])
def get_makeup(): #params setup
    params = {
        'product_type': flask.request.args.get('product_type'),
        'product_category': flask.request.args.get('product_category'),
        'product_tags': flask.request.args.get('product_tags'),
        'brand': flask.request.args.get('brand'),
        'price_greater_than': flask.request.args.get('price_greater_than'),
        'price_less_than': flask.request.args.get('price_less_than'),
        'rating_greater_than': flask.request.args.get('rating_greater_than'),
        'rating_less_than': flask.request.args.get('rating_less_than')
    }
    params = {k: v for k, v in params.items() if v is not None} #param filtering
    
    response = requests.get('https://makeup-api.herokuapp.com/api/v1/products.json', params=params, verify=False)
    data=response.json()
    filtered_data = [ #filtering out unnecessary cols
        {
            'id': product['id'],
            'brand': product['brand'],
            'name': product['name'],
            'price': product['price'],
            'price_sign': product['price_sign'],
            'currency': product['currency'],
            'api_featured_image': product['api_featured_image'],
            'product_link': product['product_link'],
            'website_link': product['website_link'],
            'description': BeautifulSoup(product['description'], 'html.parser').get_text() if product['description'] else '', #using beuatiful soup to parse html
            'rating': product['rating'],
            'product_type': product['product_type'],
            'tag_list': product['tag_list'],
            'product_colors': product['product_colors']
        }
        for product in data[:10] #only need 10 results
    ]
    
    return flask.jsonify(filtered_data) #jsonify the filtered results
    
@app.route('/api/recommended_uncapped', methods=['GET'])#as the name suggests, this endpoint returns all the results without any limit
def get_makeup_uncapped(): #params setup
    params = {
        'product_type': flask.request.args.get('product_type'),
        'product_category': flask.request.args.get('product_category'),
        'product_tags': flask.request.args.get('product_tags'),
        'brand': flask.request.args.get('brand'),
        'price_greater_than': flask.request.args.get('price_greater_than'),
        'price_less_than': flask.request.args.get('price_less_than'),
        'rating_greater_than': flask.request.args.get('rating_greater_than'),
        'rating_less_than': flask.request.args.get('rating_less_than')
    }
    params = {k: v for k, v in params.items() if v is not None} #param filtering
    
    response = requests.get('https://makeup-api.herokuapp.com/api/v1/products.json', params=params, verify=False)
    data=response.json()
    filtered_data = [ #filtering out unnecessary cols
        {
            'id': product['id'],
            'brand': product['brand'],
            'name': product['name'],
            'price': product['price'],
            'price_sign': product['price_sign'],
            'currency': product['currency'],
            'api_featured_image': product['api_featured_image'],
            'product_link': product['product_link'],
            'website_link': product['website_link'],
            'description': BeautifulSoup(product['description'], 'html.parser').get_text() if product['description'] else '', #using beuatiful soup to parse html
            'rating': product['rating'],
            'product_type': product['product_type'],
            'tag_list': product['tag_list'],
            'product_colors': product['product_colors']
        }
        for product in data 
    ]
    
    return flask.jsonify(filtered_data) #jsonify the filtered results

# allows user to get a specific product by id. try out /api/specific/1048
@app.route('/api/specific/<int:product_id>', methods=['GET'])
def get_specific(product_id):
    response = requests.get(
        f'https://makeup-api.herokuapp.com/api/v1/products/{product_id}.json', verify=False)
    return response.json()

@app.route('/supabase/getPreference', methods=['GET'])
def get_user_preferences():
    try:
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({"message": "User ID is required"}), 400

        response = supabase.table('user_preferences').select('preferences').eq('id', user_id).single().execute()

        if response.data is None:
            return jsonify({"message": "Error fetching user preferences"}), 500

        return jsonify(response.data), 200
    except Exception as e:
        return jsonify({"message": "Internal Server Error", "error": str(e)}), 500

@app.route('/supabase/getCart', methods=['GET'])
def get_user_cart():
    try:
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({"message": "User ID is required"}), 400

        response = supabase.table('user_preferences').select('cart').eq('id', user_id).single().execute()

        if response.data is None:
            return jsonify({"message": "Error fetching user preferences"}), 500

        return jsonify(response.data), 200
    except Exception as e:
        return jsonify({"message": "Internal Server Error", "error": str(e)}), 500
if __name__ == '__main__':
    app.run(debug=True, port=5000)
    '''try the below  link on local host 5000'''