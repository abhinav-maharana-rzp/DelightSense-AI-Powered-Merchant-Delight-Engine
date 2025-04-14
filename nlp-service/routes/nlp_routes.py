from flask import Blueprint, request, jsonify
from services.sentiment import analyze_sentiment
from services.summarizer import summarize_text
# from services.voice_assistant import transcribe_audio, respond_to_voice
import os

nlp_bp = Blueprint('nlp', __name__)

# Sentiment Analysis Route
@nlp_bp.route('/sentiment', methods=['POST'])
def sentiment_route():
    data = request.json
    text = data.get("text", "")
    if not text:
        return jsonify({"error": "Missing text"}), 400
    try:
        result = analyze_sentiment(text)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": "Sentiment analysis failed", "message": str(e)}), 500

# Text Summarization Route
@nlp_bp.route('/summarize', methods=['POST'])
def summarize_route():
    print("Received request for summarization")  # Debug statement
    data = request.json
    text = data.get("text", "")
    if not text:
        print("Missing text in request")  # Debug statement
        return jsonify({"error": "Missing text"}), 400
    try:
        result = summarize_text(text)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": "Summarization failed", "message": str(e)}), 500

# Voice Assistant Route
# @nlp_bp.route('/voice-assistant', methods=['POST'])
# def voice_assistant_route():
#     # Check if audio file is in the request
#     if 'audio' not in request.files:
#         return jsonify({"error": "Missing audio file"}), 400
#
#     audio_file = request.files['audio']
#
#     # Check for valid audio file extension (you can also check mime type if needed)
#     allowed_extensions = ['.mp3', '.wav', '.flac']
#     file_extension = os.path.splitext(audio_file.filename)[1].lower()
#
#     if file_extension not in allowed_extensions:
#         return jsonify({"error": "Invalid file type. Allowed types: .mp3, .wav, .flac"}), 400
#
#     # Save audio file temporarily
#     file_path = os.path.join("temp_audio", audio_file.filename)
#     os.makedirs("temp_audio", exist_ok=True)
#     audio_file.save(file_path)
#
#     try:
#         # Transcribe and respond to the voice input
#         transcript = transcribe_audio(file_path)
#         response = respond_to_voice(transcript)
#         return jsonify({
#             "transcript": transcript,
#             "response": response
#         })
#     except Exception as e:
#         return jsonify({"error": "Voice processing failed", "message": str(e)}), 500
#     finally:
#         # Cleanup the temporary audio file
#         if os.path.exists(file_path):
#             os.remove(file_path)
