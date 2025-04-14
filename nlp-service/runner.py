import pandas as pd
import json
import requests
from processor import process_entry

def run():
    df = pd.read_csv("data/merchant_behavior.csv")
    results = []

    for _, row in df.iterrows():
        entry = {
            "merchant_id": row["merchant_id"],
            "text": row["behavior"]
        }
        enriched = process_entry(entry)
        results.append(enriched)

    with open("data/processed_behavior.json", "w") as f:
        json.dump(results, f, indent=2)

if __name__ == "__main__":
    run()
