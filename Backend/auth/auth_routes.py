from flask import Blueprint, request, jsonify

auth_bp = Blueprint("auth_bp", __name__)

users = {}

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    if email in users:
        return jsonify({"message": "User already exists"}), 400
    users[email] = password
    return jsonify({"message": "User registered successfully"})

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    if users.get(email) == password:
        return jsonify({"message": "Login successful"})
    return jsonify({"message": "Invalid credentials"}), 401
