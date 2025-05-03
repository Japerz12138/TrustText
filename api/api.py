import time
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:8081"])

@app.route('/analyze', methods=['POST'])
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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
