import os
import openai
import json
import requests

azure_api_key = os.getenv("OPENAI_API_KEY")
azure_endpoint = "https://fy26-hackon-q1.openai.azure.com/openai/deployments/team-wasuli-ai/chat/completions?api-version=2025-01-01-preview"

headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {azure_api_key}"
}

def analyze_sentiment(text):
    try:
        # Prepare the payload for the Azure OpenAI request
        payload = {
            "messages": [
                {"role": "user", "content": text}
            ],
            "max_tokens": 150,  # You can adjust this based on your requirement
            "temperature": 0.7  # You can adjust this as well
        }

        # Send POST request to Azure OpenAI endpoint
        response = requests.post(azure_endpoint, headers=headers, data=json.dumps(payload))

        # Check for successful response
        if response.status_code == 200:
            result = response.json()
            sentiment = result['choices'][0]['message']['content']
            return {"sentiment": sentiment}
        else:
            return {"error": "Sentiment analysis failed", "message": response.text}
    
    except Exception as e:
        return {"error": "Sentiment analysis failed", "message": str(e)}