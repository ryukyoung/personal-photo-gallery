import os
import uuid
from flask import Blueprint, request, jsonify, session, current_app
from werkzeug.utils import secure_filename
from models import get_db

photos_bp = Blueprint("photos", __name__)

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp"}

def login_required():
    return "user_id" in session

def allowed_file(filename):
    if "." not in filename:
        return False

    extension = filename.rsplit(".", 1)[1].lower()
    return extension in ALLOWED_EXTENSIONS

def make_photo_response(photo):
    return {
        "id": photo["id"],
        "user_id": photo["user_id"],
        "username": photo["username"],
        "description": photo["description"],
        "keywords": photo["keywords"],
        "image_url": f"http://localhost:5173/uploads/{photo['filename']}",
        "created_at": photo["created_at"]
    }

@photos_bp.route("", methods=["GET"])
def get_photos():
    if not login_required():
        return jsonify({"error": "Sign in required."}), 401

    db = get_db()

    photos = db.execute("""
        SELECT photos.id, photos.user_id, photos.filename, photos.description,
               photos.keywords, photos.created_at, users.username
        FROM photos
        JOIN users ON photos.user_id = users.id
        ORDER BY photos.created_at DESC
    """).fetchall()

    result = []

    for photo in photos:
        result.append(make_photo_response(photo))

    return jsonify(result), 200

@photos_bp.route("/<int:photo_id>", methods=["GET"])
def get_photo(photo_id):
    if not login_required():
        return jsonify({"error": "Sign in required."}), 401

    db = get_db()

    photo = db.execute("""
        SELECT photos.id, photos.user_id, photos.filename, photos.description,
               photos.keywords, photos.created_at, users.username
        FROM photos
        JOIN users ON photos.user_id = users.id
        WHERE photos.id = ?
    """, (photo_id,)).fetchone()

    if photo is None:
        return jsonify({"error": "Photo not found."}), 404

    return jsonify(make_photo_response(photo)), 200

@photos_bp.route("", methods=["POST"])
def upload_photo():
    if not login_required():
        return jsonify({"error": "Sign in required."}), 401

    if "image" not in request.files:
        return jsonify({"error": "Photo file is required."}), 400

    image = request.files["image"]
    description = request.form.get("description", "").strip()
    keywords = request.form.get("keywords", "").strip()

    if image.filename == "":
        return jsonify({"error": "Photo file is required."}), 400

    if not description or not keywords:
        return jsonify({"error": "Description and keywords are required."}), 400

    if not allowed_file(image.filename):
        return jsonify({"error": "Invalid file type."}), 400

    original_filename = secure_filename(image.filename)
    extension = original_filename.rsplit(".", 1)[1].lower()
    saved_filename = f"{uuid.uuid4().hex}.{extension}"

    upload_folder = current_app.config["UPLOAD_FOLDER"]
    save_path = os.path.join(upload_folder, saved_filename)

    image.save(save_path)

    db = get_db()

    db.execute("""
        INSERT INTO photos (user_id, filename, description, keywords)
        VALUES (?, ?, ?, ?)
    """, (
        session["user_id"],
        saved_filename,
        description,
        keywords
    ))

    db.commit()

    return jsonify({"message": "Photo uploaded successfully."}), 201

@photos_bp.route("/<int:photo_id>", methods=["PUT"])
def update_photo(photo_id):
    if not login_required():
        return jsonify({"error": "Sign in required."}), 401

    data = request.get_json()

    description = data.get("description", "").strip()
    keywords = data.get("keywords", "").strip()

    if not description or not keywords:
        return jsonify({"error": "Description and keywords are required."}), 400

    db = get_db()

    photo = db.execute(
        "SELECT * FROM photos WHERE id = ?",
        (photo_id,)
    ).fetchone()

    if photo is None:
        return jsonify({"error": "Photo not found."}), 404

    if photo["user_id"] != session["user_id"]:
        return jsonify({"error": "You can only edit your own photo."}), 403

    db.execute("""
        UPDATE photos
        SET description = ?, keywords = ?
        WHERE id = ?
    """, (
        description,
        keywords,
        photo_id
    ))

    db.commit()

    return jsonify({"message": "Photo updated successfully."}), 200

@photos_bp.route("/search", methods=["GET"])
def search_photos():
    if not login_required():
        return jsonify({"error": "Sign in required."}), 401

    keyword = request.args.get("keyword", "").strip()

    if not keyword:
        return jsonify([]), 200

    db = get_db()

    photos = db.execute("""
        SELECT photos.id, photos.user_id, photos.filename, photos.description,
               photos.keywords, photos.created_at, users.username
        FROM photos
        JOIN users ON photos.user_id = users.id
        WHERE photos.keywords LIKE ?
        ORDER BY photos.created_at DESC
    """, (f"%{keyword}%",)).fetchall()

    result = []

    for photo in photos:
        result.append(make_photo_response(photo))

    return jsonify(result), 200
