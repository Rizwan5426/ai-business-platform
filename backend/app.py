from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import os

app = Flask(__name__)
CORS(app)

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json

    revenue = int(data.get("revenue"))
    customers = int(data.get("customers"))

    predicted_revenue = revenue + random.randint(5000, 20000)

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
        "insights": insights,
        "marketing": marketing
    })

# ✅ IMPORTANT FOR DEPLOYMENT
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)