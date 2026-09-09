import os
from urllib.parse import quote

import requests
from dotenv import load_dotenv


load_dotenv()

backend_url = os.getenv("backend_url", "http://localhost:3030").rstrip("/")
sentiment_analyzer_url = os.getenv(
    "sentiment_analyzer_url",
    "http://localhost:5050/",
).rstrip("/")


def get_request(endpoint, **kwargs):
    params = {key: value for key, value in kwargs.items() if value is not None}
    request_url = f"{backend_url}/{endpoint.lstrip('/')}"
    print(f"GET from {request_url}")
    try:
        response = requests.get(request_url, params=params, timeout=15)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as error:
        print(f"Network exception occurred: {error}")
        return []


def analyze_review_sentiments(text):
    encoded_text = quote(text, safe="")
    request_url = f"{sentiment_analyzer_url}/analyze/{encoded_text}"
    try:
        response = requests.get(request_url, timeout=15)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as error:
        print(f"Sentiment service exception: {error}")
        return {"sentiment": "neutral"}


def post_review(data_dict):
    request_url = f"{backend_url}/insert_review"
    try:
        response = requests.post(request_url, json=data_dict, timeout=15)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as error:
        print(f"Review service exception: {error}")
        return None
