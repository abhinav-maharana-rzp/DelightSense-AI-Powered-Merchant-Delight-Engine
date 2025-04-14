from flask import Flask, jsonify
import subprocess
import os
import json
import requests

app = Flask(__name__)

PROCESSED_PATH = '../nlp-service/data/processed_behavior.json'
SLACK_WEBHOOK = os.getenv("SLACK_ALERT_HOOK")

def run_nlp_enrichment():
    """Runs the NLP enrichment pipeline from nlp-service"""
    try:
        subprocess.run(['python3', '../nlp-service/runner.py'], check=True)
        return True, "NLP enrichment complete."
    except subprocess.CalledProcessError as e:
        return False, f"Error running NLP enrichment: {e}"

def send_slack_alerts():
    """Sends Slack alerts for negative sentiment entries"""
    try:
        with open(PROCESSED_PATH) as f:
            data = json.load(f)

        alerted = 0
        for merchant in data:
            if merchant.get("sentiment", "").lower() == "negative":
                payload = {
                    "text": f"⚠️ *Frustrated Merchant Detected*\n*Merchant ID:* {merchant['merchant_id']}\n*Summary:* {merchant.get('summary', '')}"
                }
                requests.post(SLACK_WEBHOOK, json=payload)
                alerted += 1

        return True, f"{alerted} alert(s) sent."
    except Exception as e:
        return False, f"Error sending Slack alerts: {str(e)}"

@app.route('/run-automation', methods=['POST'])
def run_automation():
    success, nlp_msg = run_nlp_enrichment()
    if not success:
        return jsonify({"error": nlp_msg}), 500

    success, alert_msg = send_slack_alerts()
    if not success:
        return jsonify({"error": alert_msg}), 500

    return jsonify({
        "message": "Automation complete.",
        "details": {
            "nlp": nlp_msg,
            "slack": alert_msg
        }
    })

if __name__ == "__main__":
    app.run(debug=True, port=7000)
