from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_bcrypt import Bcrypt
import jwt
import datetime
import random
import os

app = Flask(__name__)
bcrypt = Bcrypt(app)

# SECRET KEY (change later in env)
app.config['SECRET_KEY'] = 'secret123'

CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# 🔥 TEMP DATABASE (later replace with real DB)
users = []

# -----------------------
# ROOT
# -----------------------
@app.route('/')
def home():
    return "Backend is LIVE"

# -----------------------
# SIGNUP
# -----------------------
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Missing fields"}), 400

    # check user exists
    for user in users:
        if user["email"] == email:
            return jsonify({"error": "User already exists"}), 400

    hashed = bcrypt.generate_password_hash(password).decode('utf-8')

    users.append({
        "email": email,
        "password": hashed
    })

    return jsonify({"message": "User created successfully"})

# -----------------------
# LOGIN
# -----------------------
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    for user in users:
        if user["email"] == email:
            if bcrypt.check_password_hash(user["password"], password):

                token = jwt.encode({
                    "user": email,
                    "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
                }, app.config['SECRET_KEY'], algorithm="HS256")

                return jsonify({"token": token})

    return jsonify({"error": "Invalid credentials"}), 401

# -----------------------
# PROTECTED ANALYZE
# -----------------------
@app.route('/analyze', methods=['POST', 'OPTIONS'])
def analyze():

    if request.method == "OPTIONS":
        return jsonify({"message": "OK"}), 200

    # 🔐 CHECK TOKEN
    token = request.headers.get("Authorization")

    if not token:
        return jsonify({"error": "Token missing"}), 401

    try:
        jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
    except:
        return jsonify({"error": "Invalid token"}), 401

    data = request.get_json(silent=True) or {}

    revenue = int(data.get("revenue", 0))
    customers = int(data.get("customers", 0))

    predicted_revenue = revenue + random.randint(5000, 20000)

    growth = int((predicted_revenue - revenue) / revenue * 100) if revenue > 0 else 0
    growth = min(growth, 100)

    return jsonify({
        "predicted_revenue": predicted_revenue,
        "growth": growth,
        "insights": ["AI-generated insights"],
        "marketing": ["Strategy A", "Strategy B"]
    })

# -----------------------
# RUN
# -----------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)