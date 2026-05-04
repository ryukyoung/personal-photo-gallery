import { useEffect, useState } from "react";
import api from "../api/api";
import PhotoCard from "../components/PhotoCard";
import { isLoggedIn } from "../utils/auth";

function PhotoListPage() {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    if (!isLoggedIn()) return;

    api
      .get("/api/photos")
      .then((res) => setPhotos(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!isLoggedIn()) {
    return <p>You must sign in to view photos.</p>;
  }

  return (
    <div>
      <h1>All Photos</h1>

      {photos.length === 0 ? (
        <p>No photos uploaded yet.</p>
      ) : (
        <div className="photo-grid">
          {photos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} />
          ))}
        </div>
      )}
    </div>
  );
}

export default PhotoListPage;
