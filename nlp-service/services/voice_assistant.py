import os
import openai
import whisper
import requests
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)

# Load API key
azure_api_key = os.getenv("OPENAI_API_KEY")
if not azure_api_key:
    raise ValueError("OPENAI_API_KEY environment variable not set.")

# Azure OpenAI endpoint (update if needed)
azure_endpoint = "https://fy26-hackon-q1.openai.azure.com/openai/deployments/team-wasuli-ai/chat/completions?api-version=2025-01-01-preview"

# Initialize Whisper model
model = whisper.load_model("base")

# Initialize FFmpeg via imageio
import imageio_ffmpeg
os.environ["PATH"] += os.pathsep + os.path.dirname(imageio_ffmpeg.get_ffmpeg_exe())

# Headers for Azure OpenAI
headers = {
    "Content-Type": "application/json",
    "api-key": azure_api_key
}

# 🔊 Transcribe audio
def transcribe_audio(audio_path):
    if not os.path.exists(audio_path):
        logging.error(f"Audio file at {audio_path} does not exist.")
        return None

    try:
        result = model.transcribe(audio_path)
        return result['text']
    except Exception as e:
        logging.error("❌ Transcription error: %s", str(e))
        return None

# 🤖 Generate response via Azure OpenAI
def respond_to_voice(text):
    if not text:
        return "❌ No input text received."

    system_prompt = "You are a helpful voice assistant."
    user_message = f"The user said: \"{text}\". Respond appropriately."

    payload = {
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ],
        "max_tokens": 150,
        "temperature": 0.7
    }

    try:
        response = requests.post(azure_endpoint, headers=headers, json=payload)

        # Handle successful response
        if response.status_code == 200:
            result = response.json()
            reply = result['choices'][0]['message']['content'].strip()
            return reply
        else:
            logging.error("❌ Azure OpenAI error: %s %s", response.status_code, response.text)
            return f"[Error {response.status_code}] {response.text}"

    except requests.exceptions.RequestException as e:
        logging.error("❌ Request failed: %s", str(e))
        return f"[Exception] {str(e)}"
