import json
import os

import nltk
from flask import Flask, jsonify
from nltk.sentiment import SentimentIntensityAnalyzer


app = Flask("Sentiment Analyzer")
nltk.data.path.append(os.path.join(os.path.dirname(__file__), "sentiment"))
sia = SentimentIntensityAnalyzer()


@app.get("/")
def home():
    return "Welcome to the Sentiment Analyzer. Use /analyze/text."


@app.get("/analyze/<path:input_text>")
def analyze_sentiment(input_text):
    scores = sia.polarity_scores(input_text)
    compound = scores["compound"]
    if compound >= 0.05:
        sentiment = "positive"
    elif compound <= -0.05:
        sentiment = "negative"
    else:
        sentiment = "neutral"
    print(json.dumps({"text": input_text, "scores": scores}))
    return jsonify({"sentiment": sentiment})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
