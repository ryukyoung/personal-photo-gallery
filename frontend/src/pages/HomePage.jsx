import { useEffect, useState } from "react";
import UserList from "../components/UserList";
import api from "../api/api";
import { isLoggedIn } from "../utils/auth";
import { Link } from "react-router-dom";

function HomePage() {
  const [users, setUsers] = useState([]);
  const loggedIn = isLoggedIn();

  useEffect(() => {
    api
      .get("/api/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Personal Photo Gallery</h1>

      <UserList users={users} />

      {loggedIn ? (
        <div className="home-action">
          <Link to="/photos" className="primary-button">
            View All Photos
          </Link>
        </div>
      ) : (
        <p className="notice">Sign in to view and upload photos.</p>
      )}
    </div>
  );
}

export default HomePage;
