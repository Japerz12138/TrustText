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

def load_sus_keywords(filepath):
    with open(filepath, 'r') as f:
        keywords = [line.strip() for line in f.readlines()]
    return keywords

def analyze_keywords(text):
    sus_keywords = load_sus_keywords('model/sus_keywords.txt')
    explanation = []

    for word in sus_keywords:
        if word in text.lower():
            explanation.append(f"Deteced suspicious keyword: '{word}'")

    if not explanation:
        explanation.append("No strong suspicious keywords detected")
    return explanation
        
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
    print('Sus Score: ', final_sus_score)
    explanation = analyze_keywords(message)

    #Sus Score offset due to the scale of the model (10% offset)
    if sus_score <= 80:
        final_sus_score = final_sus_score - 10

    if final_sus_score >= 80:
        status = 'dangerous'
    elif final_sus_score >= 50:
        status = 'sus'
    else:
        status = 'safe'

    print('Sus Score After adjust: ', final_sus_score)


    return jsonify({
        'status': status,
        'sus_score': final_sus_score,
        'explanation': explanation,
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
