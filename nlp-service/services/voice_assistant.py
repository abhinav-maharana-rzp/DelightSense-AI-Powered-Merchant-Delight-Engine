import os
import openai
import whisper
import requests
import json

azure_api_key = os.getenv("OPENAI_API_KEY")
azure_endpoint = "https://fy26-hackon-q1.openai.azure.com/openai/deployments/team-wasuli-ai/chat/completions?api-version=2025-01-01-preview"

# Whisper model initialization (using local Whisper model)
model = whisper.load_model("base")

# Define headers for Azure API requests
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {azure_api_key}"
}

# Transcribe audio using Whisper
def transcribe_audio(audio_path):
    result = model.transcribe(audio_path)
    return result['text']

# Respond to transcribed voice using Azure OpenAI
def respond_to_voice(text):
    prompt = f"You are a helpful voice assistant. The user said: \"{text}\". Respond appropriately."

    payload = {
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 150,  # Adjust as needed
        "temperature": 0.7   # Adjust for creativity
    }

    try:
        # Send POST request to Azure OpenAI endpoint
        response = requests.post(azure_endpoint, headers=headers, data=json.dumps(payload))

        # Check if the request was successful
        if response.status_code == 200:
            result = response.json()
            reply = result['choices'][0]['message']['content'].strip()
            return reply
        else:
            return {"error": "Voice response failed", "message": response.text}
    
    except Exception as e:
        return {"error": "Voice response failed", "message": str(e)}
