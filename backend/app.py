from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import os

app = Flask(__name__)

# ✅ CORS fix
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# ✅ Root route (for testing)
@app.route('/')
def home():
    return "Backend is LIVE"

# ✅ Analyze API
@app.route('/analyze', methods=['POST', 'OPTIONS'])
def analyze():

    # ✅ Handle preflight request (important for browser)
    if request.method == "OPTIONS":
        return jsonify({"message": "OK"}), 200

    data = request.get_json(silent=True) or {}

    try:
        revenue = int(data.get("revenue", 0))
        customers = int(data.get("customers", 0))
    except:
        return jsonify({"error": "Invalid input"}), 400

    predicted_revenue = revenue + random.randint(5000, 20000)

    # ✅ Growth calculation (max 100%)
    if revenue > 0:
        growth = int((predicted_revenue - revenue) / revenue * 100)
    else:
        growth = 0

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

# ✅ Deployment config (REQUIRED for Render)
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)