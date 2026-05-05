from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import os

app = Flask(__name__)
CORS(app)

# ✅ FIX: add root route
@app.route('/')
def home():
    return "Backend is LIVE"

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json

    revenue = int(data.get("revenue"))
    customers = int(data.get("customers"))

    predicted_revenue = revenue + random.randint(5000, 20000)

    # ✅ growth limit <= 100%
    growth = int((predicted_revenue - revenue) / revenue * 100) if revenue > 0 else 0
    growth = min(growth, 100)

    insights = []
    if customers < 100:
        insights.append("Low customers → improve marketing")
    else:
        insights.append("Good customer base")

    marketing = [
        "Use Instagram ads",
        "Offer discounts",
        "Run referral programs"
    ]

    return jsonify({
        "predicted_revenue": predicted_revenue,
        "growth": growth,
        "insights": insights,
        "marketing": marketing
    })

# ✅ deployment config
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)