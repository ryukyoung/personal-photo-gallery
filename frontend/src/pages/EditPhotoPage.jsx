import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import { isLoggedIn } from "../utils/auth";

function EditPhotoPage() {
  const { photoId } = useParams();
  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");

  useEffect(() => {
    api
      .get(`/api/photos/${photoId}`)
      .then((res) => {
        setDescription(res.data.description);
        setKeywords(res.data.keywords);
      })
      .catch((err) => console.error(err));
  }, [photoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/api/photos/${photoId}`, {
        description,
        keywords,
      });
      navigate("/photos");
    } catch {
      alert("Photo update failed.");
    }
  };

  if (!isLoggedIn()) {
    return <p>You must sign in to edit photos.</p>;
  }

  return (
    <div className="form-page">
      <h1>Edit Photo Information</h1>

      <form onSubmit={handleSubmit} className="form-box">
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
          required
        />

        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default EditPhotoPage;
