import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, removeUser } from "../utils/auth";

function Navbar() {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();

  const handleLogout = () => {
    removeUser();
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        Personal Photo Gallery
      </Link>

      <div className="nav-links">
        <Link to="/">Users</Link>

        {loggedIn && (
          <>
            <Link to="/photos">Photos</Link>
            <Link to="/photos/upload">Upload</Link>
            <Link to="/search">Search</Link>
            <Link to="/messages">Messages</Link>
          </>
        )}

        {!loggedIn ? (
          <>
            <Link to="/login">Sign In</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        ) : (
          <button onClick={handleLogout} className="link-button">
            Sign Out
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
