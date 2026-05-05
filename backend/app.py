from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import os

app = Flask(__name__)
CORS(app)

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json

    try:
        revenue = int(data.get("revenue", 0))
        customers = int(data.get("customers", 0))
    except:
        return jsonify({"error": "Invalid input"}), 400

    # Prediction
    predicted_revenue = revenue + random.randint(5000, 20000)

    # ✅ Growth calculation (MAX 100%)
    if revenue > 0:
        growth = ((predicted_revenue - revenue) / revenue) * 100
        growth = min(round(growth, 2), 100)
    else:
        growth = 0

    # Insights (your logic kept)
    insights = []
    if customers < 100:
        insights.append("Low customers → improve marketing")
    else:
        insights.append("Good customer base")

    # Marketing (your logic kept)
    marketing = [
        "Use Instagram ads",
        "Offer discounts",
        "Run referral programs"
    ]

    return jsonify({
        "predicted_revenue": predicted_revenue,
        "growth": growth,   # ✅ added
        "insights": insights,
        "marketing": marketing
    })

# ✅ REQUIRED FOR DEPLOYMENT
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)