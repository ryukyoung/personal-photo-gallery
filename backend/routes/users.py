from flask import Blueprint, jsonify
from models import get_db

users_bp = Blueprint("users", __name__)

@users_bp.route("", methods=["GET"])
def get_users():
    db = get_db()

    users = db.execute("""
        SELECT id, username
        FROM users
        ORDER BY id ASC
    """).fetchall()

    result = []

    for user in users:
        result.append({
            "id": user["id"],
            "username": user["username"]
        })

    return jsonify(result), 200
