# 🚀 DelightSense — AI-Powered Merchant Delight Engine

**DelightSense** is an intelligent system that predicts merchant delight/frustration using machine learning, summarizes feedback using GPT/Claude, and auto-triggers proactive actions like thank-you messages or support alerts.

---

## 📁 Monorepo Structure

merchant-delight-engine/
├── apps/
│   ├── backend/            # Node.js API with MongoDB, Swagger, Auth
│   └── frontend/           # (Planned) Next.js UI for Delight Engine Dashboard
├── ml-service/             # Python service for delight score prediction (RandomForest)
├── nlp-service/            # Python service for feedback summarization (Claude, GPT)
├── trigger-engine/         # Sends email/webhook alerts based on delight score
├── data/                   # Merchant behavior dataset (synthetic)
├── docker-compose.yml      # Multi-service dev environment
├── .gitignore
└── README.md


## 🧠 Features

| Feature               | Description                                                              |
|------------------------|--------------------------------------------------------------------------|
| 🔐 Auth & JWT          | Merchant registration and login                                          |
| 📊 Delight Prediction  | Predicts a delight score using trained ML model                          |
| 💬 Feedback Summarizer | Summarizes merchant feedback using GPT/Claude                            |
| 🎯 Trigger Engine      | Sends alerts via email/webhooks based on delight score                  |
| 📘 Swagger UI          | Full API documentation via Swagger                                       |
| 🧩 Modular Services     | Separated ML, NLP, and trigger services for easy scaling                 |

---

## 🚀 Quick Start (Without Docker)

> Make sure you have Node.js, Python 3.9+, and MongoDB installed and running.

### 🔹 Backend

```bash
cd apps/backend
npm install
npm run dev
# ➜ Backend runs at http://localhost:3001
# ➜ Swagger Docs at http://localhost:3001/api-docs
```

### 🔹 ML Service

```bash
cd ml-service
pip install -r requirements.txt
python train_model.py     # Train the model
python app.py             # Run prediction server on http://localhost:5000
```

### 🔹 NLP Service

```bash
cd nlp-service
pip install -r requirements.txt
python app.py             # Runs on http://localhost:5001
```

### 🔹 Trigger Engine
```bash
cd trigger-engine
npm install
node index.js             # Runs on http://localhost:3002
```

### 🔑 API Overview

```bash
Endpoint	Method	Auth	Description
/api/auth/login	POST	❌	Login and get JWT token
/api/auth/register	POST	❌	Register a new merchant
/api/predict	POST	✅	Get delight score prediction
/api/trigger	POST	✅	Trigger email or webhook alert
📘 API Docs: http://localhost:3001/api-docs
```

### 🧠 AI/ML/NLP Stack
```bash
Component	Tool
Delight Score	RandomForestRegressor (scikit-learn)
Feedback Summary	GPT via Azure OpenAI, Claude via Bedrock
Triggers	Email via Nodemailer, Webhooks via Axios
```

### 🗃️ Sample Data
```bash
Sample training data should be placed in:

bash
Copy
Edit
/data/merchant_behavior.csv
Expected fields: merchant_id, behavioral features..., delight_score
```

### 🛤️ Upcoming Features
 Next.js frontend dashboard

 Integration with Razorpay merchant APIs

 Delight action scheduler

 Admin view with analytics

### 👨‍💻 Author
Made with ❤️ by Team Wasuli.ai
for Razorpay's 🤖 Hack:(0)n — AI Edition
