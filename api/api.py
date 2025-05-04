#/bin/python3
from flask import Flask, request, jsonify
from flask_cors import CORS
import nltk
import joblib
from nltk.corpus import stopwords

from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np

nltk.download('punkt')
nltk.download('stopwords')

app = Flask(__name__)
CORS(app, origins=["http://localhost:8081"])

model = joblib.load('model/spam_classifier.pkl')
vectorizer = joblib.load('model/vectorizer.pkl')

stop_words = set(stopwords.words('english'))

def preprocess(text):
    text = text.lower()
    tokens = nltk.word_tokenize(text)
    tokens = [t for t in tokens if t.isalpha()]
    tokens = [t for t in tokens if t not in stop_words]
    return ' '.join(tokens)

def analyze_keywords(text, base_score):
    sus_keywords = ['free', 'win', 'winner', 'prize', 'urgent', 'claim', 'congratulations', 'guaranteed', 'immediately']
    explanation = []
    score = base_score

    for word in sus_keywords:
        if word in text.lower():
            explanation.append(f"Deteced suspicious keyword: '{word}'")
            score += 5

    if not explanation:
        explanation.append("No strong suspicious keywords detected")
    return explanation, score
        
@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    message = data.get('message', '')

    print('Message: ', message)

    if not message.strip():
        return jsonify({'error': 'Empty message'}), 400
    
    processed_message = preprocess(message)
    vTransform = vectorizer.transform([processed_message])

    
    sus_score = model.predict_proba(vTransform)[0][1]
    #print(sus_score)
    final_sus_score = int(sus_score * 100)

    #This part we keep it on to show as a demo during the presentation, DO NOT REMOVE!
    print('Score before sus word: ', final_sus_score)
    explanation, final_sus_score = analyze_keywords(message, final_sus_score)
    print('Score After sus word: ', final_sus_score)

    if final_sus_score >= 70:
        status = 'dangerous'
    elif final_sus_score >= 30:
        status = 'sus'
    else:
        status = 'safe'

    return jsonify({
        'status': status,
        'sus_score': final_sus_score,
        'explanation': explanation
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
