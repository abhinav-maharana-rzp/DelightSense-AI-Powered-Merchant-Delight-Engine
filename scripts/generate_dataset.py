import pandas as pd
import numpy as np
import os

np.random.seed(42)
n = 60000

data = {
    "merchant_id": [f"MID_{i:05d}" for i in range(n)],
    "avg_txn_value": np.random.exponential(scale=10000, size=n).round(2),
    "failed_txns_last_7d": np.random.poisson(lam=3, size=n),
    "support_tickets_last_30d": np.random.poisson(lam=2, size=n),
    "csat_score": np.clip(np.random.normal(loc=4.0, scale=0.7, size=n), 1, 5).round(1),
    "settlement_delay_avg": np.clip(np.random.normal(loc=1.5, scale=0.7, size=n), 0, 5).round(2),
    "api_failure_rate": np.clip(np.random.beta(a=2, b=10, size=n), 0, 1).round(3),
    "active_days_last_month": np.random.randint(10, 31, size=n)
}

df = pd.DataFrame(data)

def compute_delight_score(row):
    score = (
        0.3 * (row["csat_score"] / 5) +
        0.2 * (1 - row["api_failure_rate"]) +
        0.1 * (1 - row["settlement_delay_avg"] / 5) +
        0.2 * np.tanh(row["avg_txn_value"] / 20000) +
        0.1 * (row["active_days_last_month"] / 30) -
        0.05 * row["failed_txns_last_7d"] -
        0.05 * row["support_tickets_last_30d"]
    )
    return np.clip(score, 0, 1).round(3)

df["delight_score"] = df.apply(compute_delight_score, axis=1)
df.to_csv("../data/merchant_behavior.csv", index=False)
print("✅ Dataset saved to data/merchant_behavior.csv")