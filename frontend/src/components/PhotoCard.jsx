import { Link } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";

function PhotoCard({ photo }) {
  const currentUser = getCurrentUser();
  const isOwner = currentUser && currentUser.id === photo.user_id;

  const tags = (photo.keywords || "")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  return (
    <article className="photo-card">
      <div className="photo-media">
        <img
          src={photo.image_url}
          alt={photo.description}
          className="photo-image"
        />
      </div>

      <div className="photo-info">
        <p className="photo-description">{photo.description}</p>

        {tags.length > 0 && (
          <div className="chip-row">
            {tags.map((tag, i) => (
              <span key={i} className="chip">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="photo-meta">
          <span className="avatar" aria-hidden="true">
            {(photo.username || "?").charAt(0).toUpperCase()}
          </span>
          <span className="uploader">{photo.username}</span>
        </div>

        <div className="photo-actions">
          <Link to={`/messages/send/${photo.user_id}`} className="btn btn-soft">
            Direct message
          </Link>

          {isOwner && (
            <Link to={`/photos/edit/${photo.id}`} className="btn btn-ghost">
              Edit
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

export default PhotoCard;
