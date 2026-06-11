import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, removeUser } from "../utils/auth";
import api from "../api/api";

function Navbar() {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch {
      // Even if the request fails, clear the client session below.
    }
    removeUser();
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
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
              <Link to="/signup" className="nav-cta">
                Sign Up
              </Link>
            </>
          ) : (
            <button onClick={handleLogout} className="link-button">
              Sign Out
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
