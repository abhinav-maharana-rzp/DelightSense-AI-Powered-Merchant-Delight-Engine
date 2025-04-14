import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
import joblib
import os

# Load the dataset
df = pd.read_csv("../data/merchant_behavior.csv")

# Drop columns not used for training
X = df.drop(columns=["merchant_id", "delight_score"])
y = df["delight_score"]

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save model
os.makedirs("model", exist_ok=True)
joblib.dump(model, "model/model.pkl")

print("✅ Model trained and saved to model/model.pkl")
