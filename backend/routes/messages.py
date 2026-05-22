from flask import Blueprint, request, jsonify, session
from models import get_db

messages_bp = Blueprint("messages", __name__)

@messages_bp.route("", methods=["POST"])
def send_message():
    sender_id = session.get("user_id")
    if not sender_id:
        return jsonify({"error": "Unauthorized. Please sign in."}), 401

    data = request.get_json()
    receiver_id = data.get("receiver_id")
    content = data.get("content", "").strip()

    if not receiver_id or not content:
        return jsonify({"error": "Receiver ID and content are required."}), 400

    db = get_db()
    try:
        db.execute(
            "INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)",
            (sender_id, receiver_id, content)
        )
        db.commit()
        return jsonify({"message": "Message sent successfully!"}), 201
    except Exception:
        return jsonify({"error": "Message send failed."}), 500

@messages_bp.route("", methods=["GET"])
def get_messages():
    receiver_id = session.get("user_id")
    if not receiver_id:
        return jsonify({"error": "Unauthorized. Please sign in."}), 401

    db = get_db()
    messages = db.execute("""
        SELECT m.id, m.sender_id, m.receiver_id, m.content, m.created_at,
               u.username as sender_username
        FROM messages m
        JOIN users u ON m.sender_id = u.id
        WHERE m.receiver_id = ?
        ORDER BY m.created_at DESC
    """, (receiver_id,)).fetchall()

    message_list = []
    for msg in messages:
        message_list.append({
            "id": msg["id"],
            "sender_id": msg["sender_id"],
            "receiver_id": msg["receiver_id"],
            "content": msg["content"],
            "created_at": msg["created_at"],
            "sender_username": msg["sender_username"]
        })

    return jsonify(message_list), 200

@messages_bp.route("/<int:message_id>", methods=["DELETE"])
def delete_message(message_id):
    current_user_id = session.get("user_id")
    if not current_user_id:
        return jsonify({"error": "Unauthorized. Please sign in."}), 401

    db = get_db()
    msg = db.execute("SELECT * FROM messages WHERE id = ?", (message_id,)).fetchone()
    
    if not msg:
        return jsonify({"error": "Message not found."}), 404
        
    if msg["receiver_id"] != current_user_id:
        return jsonify({"error": "Forbidden. You can only delete your own messages."}), 403

    try:
        db.execute("DELETE FROM messages WHERE id = ?", (message_id,))
        db.commit()
        return jsonify({"message": "Message deleted successfully!"}), 200
    except Exception:
        return jsonify({"error": "Message delete failed."}), 500
