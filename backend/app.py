import flask
import flask_cors
from dotenv import load_dotenv
import os
import requests

load_dotenv()

app = flask.Flask(__name__)
flask_cors.CORS(app)

@app.route('/' , methods=['GET'])
def home(): #redirect a user to the correct page. currently its a suggestion to go to /api/makeup
    return 'Hey there! You are on the home page of the Makeup API. Try /api/makeup instead!'


@app.route('/api/makeup', methods=['GET'])
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
    top_ten=data[:10] #returning top 10 results
    return flask.jsonify(top_ten) #jsonify the top ten results 
#for more documentation and other query params, visit https://makeup-api.herokuapp.com/

if __name__ == '__main__':
    app.run(debug=True, port=5000)
    '''try the below  link on local host 5000'''
#/api/makeup?product_type=lipstick&brand=maybelline