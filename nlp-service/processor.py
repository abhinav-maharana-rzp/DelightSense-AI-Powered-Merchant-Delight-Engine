import requests

NLP_URLS = {
    "sentiment": "http://localhost:5000/nlp/sentiment",
    "summarize": "http://localhost:5000/nlp/summarize"
}

def process_entry(entry):
    text = entry["text"]
    enriched = {
        "merchant_id": entry["merchant_id"],
        "text": text
    }

    try:
        sent = requests.post(NLP_URLS["sentiment"], json={"text": text}).json()
        enriched["sentiment"] = sent.get("label", "unknown")

        summ = requests.post(NLP_URLS["summarize"], json={"text": text}).json()
        enriched["summary"] = summ.get("summary", "")

    except Exception as e:
        enriched["error"] = str(e)

    return enriched
