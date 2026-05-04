import { Link } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";

function PhotoCard({ photo }) {
  const currentUser = getCurrentUser();
  const isOwner = currentUser && currentUser.id === photo.user_id;

  return (
    <div className="photo-card">
      <img
        src={photo.image_url}
        alt={photo.description}
        className="photo-image"
      />

      <div className="photo-info">
        <p>{photo.description}</p>
        <p className="keywords">Keywords: {photo.keywords}</p>
        <p className="uploader">Uploaded by: {photo.username}</p>

        <div className="photo-actions">
          <Link to={`/messages/send/${photo.user_id}`}>Direct Message</Link>

          {isOwner && <Link to={`/photos/edit/${photo.id}`}>Edit</Link>}
        </div>
      </div>
    </div>
  );
}

export default PhotoCard;
