import time
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*":{"origins":"*"}})


@app.route('/api/time')
def get_time():
    return{'time':time.time()}


@app.route('/api/analyze', methods=['GET'])
def analyze():
    # Do some shit and return the string
    text = request.args.get('suspecttext')
    print(f'Api hit, Message is {text}')
    # annalyze and get the status
    if text == "Potato":
        status = 'safe'
    elif text == "Tomato":
        status = 'sus'
    elif text == 'jack':
        status = 'dangerous'
    print(f'Status analyzed, found to be {status}')
    return {'status': status}

