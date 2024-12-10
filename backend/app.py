import flask
import flask_cors
from dotenv import load_dotenv
import os
import requests
from bs4 import BeautifulSoup
import json

app = flask.Flask(__name__)
flask_cors.CORS(app)

@app.route('/' , methods=['GET'])
def home(): #redirect a user to the correct page. currently its a suggestion to go to /api/makeup
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
    
    response = requests.get('https://makeup-api.herokuapp.com/api/v1/products.json', params=params)
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
            'tag_list': product['tag_list']
        }
        for product in data[:10] #only need 10 results
    ]
    
    return flask.jsonify(filtered_data) #jsonify the filtered results
#for more documentation and other query params, visit https://makeup-api.herokuapp.com/

@app.route('/api/specific/<int:product_id>', methods=['GET']) #allows user to get a specific product by id. try out /api/specific/1048
def get_specific(product_id):
    response = requests.get(f'https://makeup-api.herokuapp.com/api/v1/products/{product_id}.json')
    
    return response.json()


if __name__ == '__main__':
    app.run(debug=True, port=5000)
    '''try the below  link on local host 5000'''
#/api/makeup?product_type=lipstick&brand=maybelline