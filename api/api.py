#/bin/python3
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:8081"])

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    message = data.get('message', '')

    print('Message: ', message)

    if not message.strip():
        return jsonify({'error': 'Empty message'}), 400
    
    #Test the connection for now
    return jsonify({
        'status': 'safe',
        'sus_score': 114,
        'explanation': ['API OKAY, CHECK BACKEND TERMINAL!']
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
