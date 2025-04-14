from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

model = joblib.load("model/model.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json

        required_fields = [
            "avg_txn_value",
            "failed_txns_last_7d",
            "support_tickets_last_30d",
            "csat_score",
            "settlement_delay_avg",
            "api_failure_rate",
            "active_days_last_month"
        ]

        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400

        input_data = np.array([[
            data["avg_txn_value"],
            data["failed_txns_last_7d"],
            data["support_tickets_last_30d"],
            data["csat_score"],
            data["settlement_delay_avg"],
            data["api_failure_rate"],
            data["active_days_last_month"]
        ]])

        score = model.predict(input_data)[0]

        return jsonify({"delight_score": round(float(score), 3)})

    except Exception as e:
        return jsonify({"error": "Prediction failed", "details": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
