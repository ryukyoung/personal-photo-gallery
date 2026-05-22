import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from models import init_db, close_db
from routes.auth import auth_bp
from routes.users import users_bp
from routes.photos import photos_bp
from routes.messages import messages_bp

app = Flask(__name__)
app.secret_key = "software-engineering-project-secret-key"

CORS(app, supports_credentials=True)

UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

app.teardown_appcontext(close_db)

with app.app_context():
    init_db()

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(users_bp, url_prefix="/api/users")
app.register_blueprint(photos_bp, url_prefix="/api/photos")
app.register_blueprint(messages_bp, url_prefix="/api/messages")

@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

@app.route("/")
def home():
    return {"message": "Personal Photo Gallery Backend"}

if __name__ == "__main__":
    app.run(debug=True)
