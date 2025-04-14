import os
import requests
import json

azure_api_key = os.getenv("OPENAI_API_KEY")
azure_endpoint = "https://fy26-hackon-q1.openai.azure.com/openai/deployments/team-wasuli-ai/chat/completions?api-version=2025-01-01-preview"

headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {azure_api_key}"
}

def summarize_text(text):
    try:

        print("Summarizing text...")  # Debug statement
        # Prepare the payload for the Azure OpenAI request
        prompt = f"Summarize the following content:\n\n{text}"
        payload = {
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "max_tokens": 150,  # Adjust this as needed
            "temperature": 0.7  # Adjust this as needed for creativity
        }

        # Send POST request to Azure OpenAI endpoint
        response = requests.post(azure_endpoint, headers=headers, data=json.dumps(payload))

        # Check for successful response
        if response.status_code == 200:
            result = response.json()
            summary = result['choices'][0]['message']['content'].strip()
            return {"summary": summary}
        else:
            return {"error": "Summarization failed", "message": response.text}
    
    except Exception as e:

        return {"error": "Summarization failed", "message": str(e)}