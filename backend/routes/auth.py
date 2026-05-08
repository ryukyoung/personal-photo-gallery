from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from models import get_db

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()

    username = data.get("username", "").strip()
    password = data.get("password", "").strip()

    if not username or not password:
        return jsonify({"error": "Username and password are required."}), 400

    db = get_db()

    existing_user = db.execute(
        "SELECT id FROM users WHERE username = ?",
        (username,)
    ).fetchone()

    if existing_user:
        return jsonify({"error": "Username already exists."}), 409

    hashed_password = generate_password_hash(password)

    db.execute(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        (username, hashed_password)
    )
    db.commit()

    return jsonify({"message": "Sign up successful."}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    username = data.get("username", "").strip()
    password = data.get("password", "").strip()

    if not username or not password:
        return jsonify({"error": "Username and password are required."}), 400

    db = get_db()

    user = db.execute(
        "SELECT * FROM users WHERE username = ?",
        (username,)
    ).fetchone()

    if user is None:
        return jsonify({"error": "Invalid username or password."}), 401

    if not check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid username or password."}), 401

    session["user_id"] = user["id"]
    session["username"] = user["username"]

    return jsonify({
        "message": "Sign in successful.",
        "user": {
            "id": user["id"],
            "username": user["username"]
        }
    }), 200

@auth_bp.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"message": "Sign out successful."}), 200

@auth_bp.route("/me", methods=["GET"])
def me():
    if "user_id" not in session:
        return jsonify({"user": None}), 200

    return jsonify({
        "user": {
            "id": session["user_id"],
            "username": session["username"]
        }
    }), 200
