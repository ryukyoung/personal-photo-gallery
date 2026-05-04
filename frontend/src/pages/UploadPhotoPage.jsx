import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { isLoggedIn } from "../utils/auth";

function UploadPhotoPage() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please select a photo.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("description", description);
    formData.append("keywords", keywords);

    try {
      await api.post("/api/photos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/photos");
    } catch {
      alert("Photo upload failed.");
    }
  };

  if (!isLoggedIn()) {
    return <p>You must sign in to upload photos.</p>;
  }

  return (
    <div className="form-page">
      <h1>Upload Photo</h1>

      <form onSubmit={handleSubmit} className="form-box">
        <label>Photo</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />

        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label>Keywords</label>
        <input
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="example: travel, family, food"
          required
        />

        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default UploadPhotoPage;
