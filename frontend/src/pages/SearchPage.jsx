import { useState } from "react";
import api from "../api/api";
import PhotoCard from "../components/PhotoCard";
import { isLoggedIn } from "../utils/auth";

function SearchPage() {
  const [keyword, setKeyword] = useState("");
  const [photos, setPhotos] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const res = await api.get(`/api/photos/search?keyword=${keyword}`);
      setPhotos(res.data);
    } catch {
      alert("Search failed.");
    }
  };

  if (!isLoggedIn()) {
    return <p>You must sign in to search photos.</p>;
  }

  return (
    <div>
      <h1>Search Photos by Keyword</h1>

      <form onSubmit={handleSearch} className="search-box">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Enter keyword"
          required
        />
        <button type="submit">Search</button>
      </form>

      <div className="photo-grid">
        {photos.map((photo) => (
          <PhotoCard key={photo.id} photo={photo} />
        ))}
      </div>
    </div>
  );
}

export default SearchPage;
