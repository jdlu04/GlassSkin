import flask
from flask import request, jsonify
import flask_cors
from dotenv import load_dotenv
import os
from supabase import create_client, Client
import requests
from bs4 import BeautifulSoup
import json

app = flask.Flask(__name__)
flask_cors.CORS(app)

load_dotenv()

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")

supabase = create_client(url, key)

# user = supabase.table("users").select().eq("id", "1").execute()
# print(user)

@app.route('/', methods=['GET'])
def home():  # redirect a user to the correct page. currently its a suggestion to go to /api/makeup
    return 'Hey there! You are on the home page of the Makeup API. Try /api/recommended instead!'


#@app.route('/api/recommended', methods=['GET'])
@app.route('/api/recommended_kit', methods=['POST'])
def get_makeup():  # params setup
    preferences = request.get_json() 
    print(preferences)
    params = {}

    for k, v in preferences.items():
        if v == 'full':
            params['product_type'] = 'foundation'
        else:
            continue

    #params = {
    #    'product_type': 'foundation'
        #'product_category': flask.request.args.get('product_category'),
        #'product_tags': flask.request.args.get('product_tags'),
        #'brand': flask.request.args.get('brand'),
        #'price_greater_than': flask.request.args.get('price_greater_than'),
        #'price_less_than': flask.request.args.get('price_less_than'),
        #'rating_greater_than': flask.request.args.get('rating_greater_than'),
        #'rating_less_than': flask.request.args.get('rating_less_than')
    #}
    # param filtering
    print(params)
    params = {k: v for k, v in params.items() if v is not None}

    response = requests.get(
        'https://makeup-api.herokuapp.com/api/v1/products.json', params=params)
    data = response.json()
    filtered_data = [  # filtering out unnecessary cols
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
            # using beuatiful soup to parse html
            'description': BeautifulSoup(product['description'], 'html.parser').get_text() if product['description'] else '',
            'rating': product['rating'],
            'product_type': product['product_type'],
            'tag_list': product['tag_list']
        }
        for product in data[:1]  # only need 10 results
    ]
    print(filtered_data)

    return flask.jsonify(filtered_data)  # jsonify the filtered results
# for more documentation and other query params, visit https://makeup-api.herokuapp.com/

# allows user to get a specific product by id. try out /api/specific/1048
@app.route('/api/specific/<int:product_id>', methods=['GET'])
def get_specific(product_id):
    response = requests.get(
        f'https://makeup-api.herokuapp.com/api/v1/products/{product_id}.json')

    return response.json()

# add user to database based on clerk response
@app.route('/api/add_user', methods=['POST'])
def add_user():
    data = request.json
    user_id = data.get("id")
    email = data.get("primaryEmailAddress")
    created_at = data.get("createdAt")
    first_name = data.get("firstName") or None
    last_name = data.get("lastName") or None

    user_data = {
        "id": user_id,
        "primaryEmailAddress": email,
        "createdAt": created_at,
        "firstName": first_name,
        "lastName": last_name,
    }

    user = supabase.table("users").select().eq("id", user_id).execute()
    if not user.data:
        user = supabase.table("users").insert(user_data).execute()
        return jsonify({"message": "User added successfully"}), 201
    else:
        return jsonify({"message": "User already exists"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
    '''try the below  link on local host 5000'''